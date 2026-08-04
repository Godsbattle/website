/**
 * CLI helper: insert/remove the live variant mode script tag in the project's
 * main HTML entry point.
 *
 * On first live run, the agent generates `.impeccable-live/config.json` in
 * the project root with the insertion target (framework-specific). On
 * every subsequent run, this script handles insert/remove deterministically
 * with zero LLM involvement.
 *
 * Usage:
 *   node live-inject.mjs --port PORT --token TOKEN   # Insert the live script tag
 *   node live-inject.mjs --remove      # Remove the live script tag
 *   node live-inject.mjs --check       # Check .impeccable-live/config.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function resolveLiveConfigPath(
  projectRoot = process.cwd(),
  override = process.env.IMPECCABLE_LIVE_CONFIG,
) {
  const lexicalRoot = path.resolve(projectRoot);
  if (override) {
    // The explicit environment override is a trusted operator path and may
    // intentionally live outside the project (for example, in a managed
    // temporary directory). The default path never receives that exception.
    return path.resolve(lexicalRoot, override);
  }
  const resolvedRoot = fs.realpathSync(lexicalRoot);
  return resolveContainedTarget(
    lexicalRoot,
    resolvedRoot,
    path.join('.impeccable-live', 'config.json'),
  );
}

const MARKER_OPEN_TEXT = 'impeccable-live-start';
const MARKER_CLOSE_TEXT = 'impeccable-live-end';

/**
 * Hard-excluded directory patterns. These are NEVER user-facing pages and
 * matching them would silently inject tracking scripts into third-party
 * code. The user cannot turn these off via config — they are the floor.
 */
const HARD_EXCLUDES = [
  '**/node_modules/**',
  '**/.git/**',
];

export async function injectCli() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node live-inject.mjs [options]

Insert or remove the live mode script tag in the project's HTML entry point.
Reads configuration from .impeccable-live/config.json in the project root.
Set IMPECCABLE_LIVE_CONFIG only for a trusted operator-controlled override;
the override may resolve outside the project root.

Modes:
  --port PORT   Insert script tag pointing at http://localhost:PORT/live.js (requires --token)
  --token TOKEN Session token embedded in the protected script URL
  --remove      Remove the script tag (if present)
  --check       Print whether the selected config exists and its content

Output (JSON):
  { ok, file, inserted|removed, config? }`);
    process.exit(0);
  }

  let configPath;
  try {
    configPath = resolveLiveConfigPath();
  } catch (error) {
    console.error(JSON.stringify({
      ok: false,
      error: 'unsafe_config_path',
      message: error.message,
    }));
    process.exitCode = 1;
    return;
  }

  if (args.includes('--check')) {
    if (!fs.existsSync(configPath)) {
      fs.mkdirSync(path.dirname(configPath), { recursive: true, mode: 0o700 });
      console.log(JSON.stringify({ ok: false, error: 'config_missing', path: configPath }));
      process.exit(0);
    }
    let cfg;
    try {
      cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (err) {
      console.log(JSON.stringify({ ok: false, error: 'config_invalid', message: err.message, path: configPath }));
      return;
    }
    try {
      validateConfig(cfg);
    } catch (err) {
      console.log(JSON.stringify({ ok: false, error: 'config_invalid', message: err.message, path: configPath }));
      return;
    }
    console.log(JSON.stringify({ ok: true, config: cfg, path: configPath }));
    return;
  }

  // Load config
  if (!fs.existsSync(configPath)) {
    console.error(JSON.stringify({ ok: false, error: 'config_missing', path: configPath }));
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  validateConfig(config);

  let resolvedTargets;
  try {
    resolvedTargets = resolveFileTargets(process.cwd(), config);
  } catch (error) {
    console.error(JSON.stringify({
      ok: false,
      error: 'unsafe_target',
      message: error.message,
    }));
    process.exitCode = 1;
    return;
  }

  if (resolvedTargets.length === 0) {
    console.error(JSON.stringify({ ok: false, error: 'no_targets' }));
    process.exitCode = 1;
    return;
  }

  if (args.includes('--remove')) {
    const prepared = resolvedTargets.map(({ relativePath: relFile, absolutePath: absFile }) => {
      if (!fs.existsSync(absFile)) {
        return { result: { file: relFile, error: 'file_not_found' } };
      }
      let content;
      try {
        content = fs.readFileSync(absFile, 'utf-8');
      } catch (error) {
        return { result: { file: relFile, error: 'file_read_failed', message: error.message } };
      }
      const detagged = removeTag(content, config.commentSyntax);
      const updated = revertCspMeta(detagged);
      const result = updated === content
        ? { file: relFile, removed: false, note: 'no tag present' }
        : {
            file: relFile,
            removed: detagged !== content,
            cspReverted: updated !== detagged,
          };
      return {
        result,
        update: {
          absolutePath: absFile,
          originalContent: content,
          updatedContent: updated,
        },
      };
    });

    const results = prepared.map(({ result }) => result);
    if (results.some((result) => result.error)) {
      console.error(JSON.stringify({ ok: false, error: 'target_preflight_failed', results }));
      process.exitCode = 1;
      return;
    }
    try {
      commitFileUpdates(prepared.map(({ update }) => update));
    } catch (error) {
      console.error(JSON.stringify({ ok: false, error: 'write_failed', message: error.message }));
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify({ ok: true, results }));
    return;
  }

  // Insert mode — need --port
  const portIdx = args.indexOf('--port');
  const port = portIdx !== -1 ? parseInt(args[portIdx + 1], 10) : NaN;
  const tokenIdx = args.indexOf('--token');
  const token = tokenIdx !== -1 ? args[tokenIdx + 1] : '';
  if (!Number.isFinite(port)) {
    console.error(JSON.stringify({ ok: false, error: 'missing_port' }));
    process.exit(1);
  }
  if (!token) {
    console.error(JSON.stringify({ ok: false, error: 'missing_token' }));
    process.exit(1);
  }

  const prepared = resolvedTargets.map(({ relativePath: relFile, absolutePath: absFile }) => {
    if (!fs.existsSync(absFile)) {
      return { result: { file: relFile, error: 'file_not_found' } };
    }
    let content;
    try {
      content = fs.readFileSync(absFile, 'utf-8');
    } catch (error) {
      return { result: { file: relFile, error: 'file_read_failed', message: error.message } };
    }
    const withoutOld = revertCspMeta(removeTag(content, config.commentSyntax));
    const withTag = insertTag(withoutOld, config, port, token);
    if (withTag === withoutOld) {
      return {
        result: {
          file: relFile,
          error: 'insertion_point_not_found',
          anchor: config.insertBefore || config.insertAfter,
        },
      };
    }
    const updated = patchCspMeta(withTag, port);
    return {
      result: {
        file: relFile,
        inserted: true,
        cspPatched: updated !== withTag,
      },
      update: {
        absolutePath: absFile,
        originalContent: content,
        updatedContent: updated,
      },
    };
  });
  const results = prepared.map(({ result }) => result);
  if (results.some((result) => result.error)) {
    console.error(JSON.stringify({ ok: false, error: 'target_preflight_failed', results }));
    process.exitCode = 1;
    return;
  }
  try {
    commitFileUpdates(prepared.map(({ update }) => update));
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: 'write_failed', message: error.message }));
    process.exitCode = 1;
    return;
  }
  console.log(JSON.stringify({ ok: true, port, results }));
}

/**
 * Apply a prepared set of file updates. Every update is computed before this
 * function runs. If a later write fails, restore every attempted target in
 * reverse order so callers do not leave a mixed injected/clean state.
 */
export function commitFileUpdates(
  updates,
  writeFile = (file, content) => fs.writeFileSync(file, content, 'utf-8'),
) {
  const attempted = [];
  try {
    for (const update of updates) {
      if (update.updatedContent === update.originalContent) continue;
      attempted.push(update);
      writeFile(update.absolutePath, update.updatedContent);
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const update of attempted.reverse()) {
      try {
        writeFile(update.absolutePath, update.originalContent);
      } catch (rollbackError) {
        rollbackErrors.push(`${update.absolutePath}: ${rollbackError.message}`);
      }
    }
    const rollbackDetail = rollbackErrors.length > 0
      ? `; rollback failed for ${rollbackErrors.join(', ')}`
      : '';
    throw new Error(`${error.message}${rollbackDetail}`, { cause: error });
  }
}

/**
 * Expand config.files (which may contain glob patterns) into a literal list
 * of existing file paths relative to rootDir. Literal entries pass through;
 * glob patterns are expanded via fs.globSync. HARD_EXCLUDES and config.exclude
 * are applied as filters. Duplicates are removed. Order is preserved by
 * first appearance.
 */
export function resolveFiles(rootDir, config) {
  return resolveFileTargets(rootDir, config).map((target) => target.relativePath);
}

export function resolveFileTargets(rootDir, config) {
  const patterns = config.files;
  const userExcludes = Array.isArray(config.exclude) ? config.exclude : [];
  // Dependency/VCS directories are hard exclusions even on a
  // case-insensitive filesystem or when reached through a case alias.
  const hardExcludeRegexes = HARD_EXCLUDES.map((pattern) => globToRegex(pattern, 'i'));
  const userExcludeRegexes = userExcludes.map(globToRegex);
  const resolvedRoot = fs.realpathSync(path.resolve(rootDir));
  const lexicalRoot = path.resolve(rootDir);

  const isHardExcluded = (relPath) => hardExcludeRegexes.some((re) => re.test(relPath));
  const isUserExcluded = (relPath) => userExcludeRegexes.some((re) => re.test(relPath));
  const isGlob = (s) => /[*?[]/.test(s);

  const seen = new Set();
  const out = [];
  for (const pat of patterns) {
    const normalizedPattern = normalizeTargetPattern(pat);
    assertLexicallyContained(lexicalRoot, normalizedPattern);

    if (!isGlob(normalizedPattern)) {
      // Literal path — include even if it doesn't exist yet; the caller
      // reports file_not_found per-entry. Hard exclusions remain absolute.
      if (isHardExcluded(normalizedPattern)) {
        throw new Error(`inject target is hard-excluded: ${pat}`);
      }
      if (isUserExcluded(normalizedPattern)) continue;
      addTarget(normalizedPattern);
      continue;
    }
    let matches;
    try {
      matches = fs.globSync(normalizedPattern, { cwd: lexicalRoot, withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of matches) {
      if (!ent.isFile || !ent.isFile()) continue;
      const parentPath = ent.parentPath || ent.path || lexicalRoot;
      const abs = path.isAbsolute(parentPath)
        ? path.join(parentPath, ent.name)
        : path.resolve(lexicalRoot, parentPath, ent.name);
      const rel = path.relative(lexicalRoot, abs).split(path.sep).join('/');
      if (isHardExcluded(rel) || isUserExcluded(rel)) continue;
      addTarget(rel);
    }
  }
  return out;

  function addTarget(relativeTarget) {
    const absolutePath = resolveContainedTarget(lexicalRoot, resolvedRoot, relativeTarget);
    const canonicalRelative = path.relative(resolvedRoot, absolutePath).split(path.sep).join('/');
    if (isHardExcluded(canonicalRelative)) {
      throw new Error(`inject target is hard-excluded: ${relativeTarget}`);
    }
    if (isUserExcluded(canonicalRelative)) return;
    if (seen.has(absolutePath)) return;
    seen.add(absolutePath);
    out.push({
      relativePath: canonicalRelative,
      absolutePath,
    });
  }
}

function normalizeTargetPattern(pattern) {
  if (pattern.includes('\0')) {
    throw new Error('inject target must stay inside the project root: malformed path');
  }
  if (path.isAbsolute(pattern) || path.win32.isAbsolute(pattern)) {
    throw new Error(`inject target must stay inside the project root: ${pattern}`);
  }
  const normalized = pattern.replaceAll('\\', '/');
  if (normalized.split('/').includes('..')) {
    throw new Error(`inject target must stay inside the project root: ${pattern}`);
  }
  return normalized;
}

function assertLexicallyContained(root, relativeTarget) {
  const candidate = path.resolve(root, relativeTarget);
  if (!isContainedPath(root, candidate)) {
    throw new Error(`inject target must stay inside the project root: ${relativeTarget}`);
  }
}

function resolveContainedTarget(lexicalRoot, resolvedRoot, relativeTarget) {
  const lexicalPath = path.resolve(lexicalRoot, relativeTarget);
  if (!isContainedPath(lexicalRoot, lexicalPath)) {
    throw new Error(`inject target must stay inside the project root: ${relativeTarget}`);
  }

  let existingAncestor = lexicalPath;
  const missingSegments = [];
  while (!pathEntryExists(existingAncestor)) {
    const parent = path.dirname(existingAncestor);
    if (parent === existingAncestor) {
      throw new Error(`inject target must stay inside the project root: ${relativeTarget}`);
    }
    missingSegments.unshift(path.basename(existingAncestor));
    existingAncestor = parent;
  }

  let resolvedAncestor;
  try {
    resolvedAncestor = fs.realpathSync(existingAncestor);
  } catch {
    throw new Error(`inject target must stay inside the project root: ${relativeTarget}`);
  }
  const resolvedPath = path.resolve(resolvedAncestor, ...missingSegments);
  if (!isContainedPath(resolvedRoot, resolvedPath)) {
    throw new Error(`inject target must stay inside the project root: ${relativeTarget}`);
  }
  return resolvedPath;
}

function pathEntryExists(candidate) {
  try {
    fs.lstatSync(candidate);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return false;
    throw error;
  }
}

function isContainedPath(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative.length > 0
    && relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative);
}

/**
 * Convert a glob pattern to a RegExp. Supports:
 *   **  → any number of path segments (including zero)
 *   *   → any chars except `/`
 *   ?   → any single char except `/`
 * Paths are normalized to forward slashes before matching.
 */
function globToRegex(pattern, flags = '') {
  let re = '';
  let i = 0;
  while (i < pattern.length) {
    const c = pattern[i];
    if (c === '*') {
      if (pattern[i + 1] === '*') {
        // ** — any number of segments, including zero. Handle the common
        // **/ and /** forms so `a/**/b` matches `a/b` as well as `a/x/y/b`.
        if (pattern[i + 2] === '/') {
          re += '(?:.*/)?';
          i += 3;
        } else {
          re += '.*';
          i += 2;
        }
      } else {
        re += '[^/]*';
        i += 1;
      }
    } else if (c === '?') {
      re += '[^/]';
      i += 1;
    } else if (/[.+^${}()|[\]\\]/.test(c)) {
      re += '\\' + c;
      i += 1;
    } else {
      re += c;
      i += 1;
    }
  }
  return new RegExp('^' + re + '$', flags);
}

// ---------------------------------------------------------------------------
// Core operations
// ---------------------------------------------------------------------------

function validateConfig(cfg) {
  if (!cfg || typeof cfg !== 'object') throw new Error('config.json must be an object');
  if (!Array.isArray(cfg.files) || cfg.files.length === 0) {
    throw new Error('config.files (non-empty string array) required');
  }
  if (!cfg.files.every((f) => typeof f === 'string' && f.length > 0)) {
    throw new Error('config.files must contain only non-empty strings');
  }
  if (cfg.exclude !== undefined) {
    if (!Array.isArray(cfg.exclude)) {
      throw new Error('config.exclude, if present, must be a string array');
    }
    if (!cfg.exclude.every((f) => typeof f === 'string' && f.length > 0)) {
      throw new Error('config.exclude must contain only non-empty strings');
    }
  }
  if (typeof cfg.insertBefore !== 'string' && typeof cfg.insertAfter !== 'string') {
    throw new Error('config.insertBefore or config.insertAfter (string) required');
  }
  if (cfg.commentSyntax !== 'html' && cfg.commentSyntax !== 'jsx') {
    throw new Error("config.commentSyntax must be 'html' or 'jsx'");
  }
  if (cfg.cspChecked !== undefined && typeof cfg.cspChecked !== 'boolean') {
    throw new Error("config.cspChecked, if present, must be a boolean");
  }
}

function commentOpen(syntax) { return syntax === 'jsx' ? '{/*' : '<!--'; }
function commentClose(syntax) { return syntax === 'jsx' ? '*/}' : '-->'; }

function buildTagBlock(syntax, port, token) {
  const open = commentOpen(syntax);
  const close = commentClose(syntax);
  return (
    open + ' ' + MARKER_OPEN_TEXT + ' ' + close + '\n' +
    '<script src="http://localhost:' + port + '/live.js?token=' + encodeURIComponent(token) + '"></script>\n' +
    open + ' ' + MARKER_CLOSE_TEXT + ' ' + close + '\n'
  );
}

function insertTag(content, config, port, token) {
  const block = buildTagBlock(config.commentSyntax, port, token);
  // insertBefore: match the LAST occurrence. Anchors like `</body>` naturally
  // belong at the end, and the same literal can appear earlier in code blocks
  // within rendered documentation pages.
  if (config.insertBefore) {
    const idx = content.lastIndexOf(config.insertBefore);
    if (idx === -1) return content;
    return content.slice(0, idx) + block + content.slice(idx);
  }
  // insertAfter: match the FIRST occurrence — typical anchors like `<head>` or
  // `<body>` open near the top of the document.
  const idx = content.indexOf(config.insertAfter);
  if (idx === -1) return content;
  const after = idx + config.insertAfter.length;
  // If the source already has a newline after the anchor, keep it before the
  // injected block. Otherwise inject directly beside the anchor. Adding a
  // synthetic newline here would make removal unable to restore exact bytes.
  const insertionPoint = content[after] === '\n' ? after + 1 : after;
  return content.slice(0, insertionPoint) + block + content.slice(insertionPoint);
}

/**
 * Remove the live script block. Matches either HTML or JSX comment markers
 * regardless of config (so stale tags from a wrong config can still be cleaned).
 *
 * Indent-preserving: captures any whitespace immediately preceding the opener
 * marker and re-emits it in place of the removed block. `insertTag` inserted
 * the block *after* the original line's indent and *before* the anchor (e.g.
 * `</body>`), which moved the indent onto the opener line and left the anchor
 * unindented. Replacing the whole block (plus its trailing newline) with just
 * the captured indent hands the indent back to the anchor that follows.
 */
function removeTag(content, _syntax) {
  const patterns = [
    /([ \t]*)<!--\s*impeccable-live-start\s*-->[\s\S]*?<!--\s*impeccable-live-end\s*-->[ \t]*\n/,
    /([ \t]*)\{\/\*\s*impeccable-live-start\s*\*\/\}[\s\S]*?\{\/\*\s*impeccable-live-end\s*\*\/\}[ \t]*\n/,
  ];
  for (const pat of patterns) {
    const next = content.replace(pat, '$1');
    if (next !== content) return next;
  }
  return content;
}

// ---------------------------------------------------------------------------
// Content-Security-Policy meta-tag patcher
//
// When the user's HTML carries `<meta http-equiv="Content-Security-Policy">`,
// the cross-origin load of /live.js (and the SSE/POST connection back to
// localhost:PORT) is blocked unless the CSP explicitly allows that origin.
//
// On insert: append `http://localhost:PORT` to `script-src` and `connect-src`,
// and stash the original `content` value in a `data-impeccable-csp-original`
// attribute (base64) so revert is exact.
//
// On remove: detect the marker attribute, decode it, restore the original
// content value verbatim, drop the marker.
//
// Header-based CSP (Next.js headers, Nuxt routeRules, SvelteKit kit.csp,
// shared helpers) is NOT patched here — those need framework-specific config
// edits and are handled via the existing detect-csp.mjs reference output.
// Only the in-source meta-tag form gets the auto-patch.
// ---------------------------------------------------------------------------

const CSP_MARKER_ATTR = 'data-impeccable-csp-original';

function findCspMetaTags(content) {
  const out = [];
  const tagRe = /<meta\s+([^>]*?)\/?>/gis;
  let m;
  while ((m = tagRe.exec(content)) !== null) {
    const attrs = m[1];
    if (!/(http-equiv|httpEquiv)\s*=\s*(['"])Content-Security-Policy\2/i.test(attrs)) continue;
    out.push({ start: m.index, end: m.index + m[0].length, full: m[0], attrs });
  }
  return out;
}

function getAttr(attrs, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(['"])([\\s\\S]*?)\\1`, 'i');
  const m = attrs.match(re);
  return m ? { quote: m[1], value: m[2], full: m[0] } : null;
}

function appendOriginToDirective(csp, directive, origin) {
  const re = new RegExp(`(^|;)(\\s*)(${directive})\\s+([^;]*)`, 'i');
  const m = csp.match(re);
  if (m) {
    const tokens = m[4].trim().split(/\s+/);
    if (tokens.includes(origin)) return csp;
    return csp.replace(re, `${m[1]}${m[2]}${m[3]} ${[...tokens, origin].join(' ')}`);
  }
  // Directive missing — add it. Use 'self' + origin so we don't inadvertently
  // narrow the policy compared to the default-src fallback (most users with
  // an explicit CSP have 'self' there).
  return csp.trim().replace(/;?\s*$/, '') + `; ${directive} 'self' ${origin}`;
}

export function patchCspMeta(content, port) {
  const tags = findCspMetaTags(content);
  if (tags.length === 0) return content;
  const origin = `http://localhost:${port}`;

  // Walk last-to-first so prior splices don't invalidate later indices.
  let result = content;
  for (let i = tags.length - 1; i >= 0; i--) {
    const tag = tags[i];
    const attrs = tag.attrs;
    if (getAttr(attrs, CSP_MARKER_ATTR)) continue; // already patched
    const contentAttr = getAttr(attrs, 'content');
    if (!contentAttr) continue;

    const original = contentAttr.value;
    let patched = original;
    patched = appendOriginToDirective(patched, 'script-src', origin);
    patched = appendOriginToDirective(patched, 'connect-src', origin);
    // The shader overlay during 'generating' creates a screenshot via
    // URL.createObjectURL, producing a `blob:` URL — img-src 'self' rejects
    // those. Add `blob:` so the overlay doesn't throw a CSP violation.
    patched = appendOriginToDirective(patched, 'img-src', 'blob:');
    if (patched === original) continue;

    const newContentAttr = `content=${contentAttr.quote}${patched}${contentAttr.quote}`;
    const marker = `${CSP_MARKER_ATTR}="${Buffer.from(original, 'utf-8').toString('base64')}"`;
    // The tagRe captures any whitespace between the last attribute and the
    // closing `/>` as part of `attrs`. Naively appending ` ${marker}` after
    // a replace would land it BEFORE that trailing space, leaving a double
    // space inside attrs and clobbering the space before `/>`. Split off
    // the trailing whitespace, splice the marker into the attribute body,
    // and re-append the original trailing whitespace so a self-closing
    // `<meta … />` round-trips byte-for-byte.
    const trailingWs = (attrs.match(/[ \t]*$/) || [''])[0];
    const attrsBody = attrs.slice(0, attrs.length - trailingWs.length);
    const newAttrs = attrsBody.replace(contentAttr.full, newContentAttr) + ' ' + marker + trailingWs;
    const newTag = tag.full.replace(attrs, newAttrs);

    result = result.slice(0, tag.start) + newTag + result.slice(tag.end);
  }
  return result;
}

export function revertCspMeta(content) {
  const tags = findCspMetaTags(content);
  if (tags.length === 0) return content;

  let result = content;
  for (let i = tags.length - 1; i >= 0; i--) {
    const tag = tags[i];
    const origAttr = getAttr(tag.attrs, CSP_MARKER_ATTR);
    if (!origAttr) continue;
    const contentAttr = getAttr(tag.attrs, 'content');
    if (!contentAttr) continue;

    let originalValue;
    try { originalValue = Buffer.from(origAttr.value, 'base64').toString('utf-8'); }
    catch { continue; }

    const newContentAttr = `content=${contentAttr.quote}${originalValue}${contentAttr.quote}`;
    let newAttrs = tag.attrs.replace(contentAttr.full, newContentAttr);
    // Drop the marker attribute and any single space immediately preceding it.
    newAttrs = newAttrs.replace(new RegExp(`\\s*${origAttr.full}`), '');
    const newTag = tag.full.replace(tag.attrs, newAttrs);

    result = result.slice(0, tag.start) + newTag + result.slice(tag.end);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Auto-execute
// ---------------------------------------------------------------------------

const _running = process.argv[1];
if (_running?.endsWith('live-inject.mjs') || _running?.endsWith('live-inject.mjs/')) {
  injectCli();
}

export { insertTag, removeTag, validateConfig, buildTagBlock };
// patchCspMeta + revertCspMeta are exported above where they're defined.
