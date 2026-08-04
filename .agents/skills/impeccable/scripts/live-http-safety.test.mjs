import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const helperUrl = new URL('./live-http-safety.mjs', import.meta.url);

function responseHeaders() {
  const headers = new Map();
  return {
    getHeader(name) {
      return headers.get(name.toLowerCase());
    },
    setHeader(name, value) {
      headers.set(name.toLowerCase(), value);
    },
  };
}

test('live HTTP requests enforce token, loopback origin, and source containment', async (t) => {
  assert.equal(existsSync(helperUrl), true, 'shared live HTTP safety helpers are required');

  const {
    applyLoopbackCors,
    hasValidSessionToken,
    isProtectedScriptPath,
    resolveProjectSourcePath,
  } = await import(helperUrl);

  await t.test('unauthenticated live.js is rejected', () => {
    const url = new URL('http://localhost:8400/live.js');
    assert.equal(isProtectedScriptPath(url.pathname), true);
    assert.equal(hasValidSessionToken(url, 'session-token'), false);
    url.searchParams.set('token', 'session-token');
    assert.equal(hasValidSessionToken(url, 'session-token'), true);
  });

  await t.test('disallowed browser origin is rejected without wildcard CORS', () => {
    const response = responseHeaders();
    assert.equal(applyLoopbackCors('https://example.com', response), false);
    assert.equal(response.getHeader('Access-Control-Allow-Origin'), undefined);
    assert.equal(response.getHeader('Vary'), 'Origin');
  });

  await t.test('loopback browser origins preserve varying preview ports', () => {
    for (const origin of [
      'http://localhost:5173',
      'https://localhost:8443',
      'http://127.0.0.1:3000',
      'http://[::1]:4173',
    ]) {
      const response = responseHeaders();
      assert.equal(applyLoopbackCors(origin, response), true, origin);
      assert.equal(response.getHeader('Access-Control-Allow-Origin'), origin);
      assert.equal(response.getHeader('Vary'), 'Origin');
    }
  });

  await t.test('origin-less local agent requests remain allowed', () => {
    const response = responseHeaders();
    assert.equal(applyLoopbackCors(undefined, response), true);
    assert.equal(response.getHeader('Access-Control-Allow-Origin'), undefined);
    assert.equal(response.getHeader('Vary'), 'Origin');
  });

  await t.test('absolute source paths are rejected even inside the project', () => {
    const projectRoot = path.resolve('/tmp/impeccable-project');
    assert.equal(resolveProjectSourcePath(projectRoot, path.join(projectRoot, 'index.html')), null);
  });

  await t.test('sibling-prefix source paths are rejected', () => {
    const projectRoot = path.resolve('/tmp/impeccable-project');
    const siblingPath = path.resolve('/tmp/impeccable-project-other/index.html');
    assert.equal(resolveProjectSourcePath(projectRoot, siblingPath), null);
  });

  await t.test('traversal and malformed source paths are rejected', () => {
    const projectRoot = path.resolve('/tmp/impeccable-project');
    assert.equal(resolveProjectSourcePath(projectRoot, '../secret.html'), null);
    assert.equal(resolveProjectSourcePath(projectRoot, 'bad\0path.html'), null);
  });

  await t.test('valid in-root relative source path resolves', () => {
    const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-source-'));
    try {
      const projectRoot = path.join(fixtureRoot, 'project');
      const sourcePath = path.join(projectRoot, 'src/index.html');
      mkdirSync(path.dirname(sourcePath), { recursive: true });
      writeFileSync(sourcePath, '<main>Preview</main>\n');
      assert.equal(resolveProjectSourcePath(projectRoot, 'src/index.html'), realpathSync(sourcePath));
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });

  await t.test('in-root symlinks cannot escape source containment', () => {
    const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-source-'));
    try {
      const projectRoot = path.join(fixtureRoot, 'project');
      const outsideRoot = path.join(fixtureRoot, 'outside');
      mkdirSync(projectRoot);
      mkdirSync(outsideRoot);
      writeFileSync(path.join(outsideRoot, 'secret.txt'), 'outside project\n');
      symlinkSync(outsideRoot, path.join(projectRoot, 'linked-outside'), 'dir');
      assert.equal(
        resolveProjectSourcePath(projectRoot, 'linked-outside/secret.txt'),
        null,
      );
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true });
    }
  });

  await t.test('injected bootstrap carries an encoded token and removal erases it', async () => {
    const { buildTagBlock, removeTag } = await import('./live-inject.mjs');
    const token = 'session token&unsafe';
    const block = buildTagBlock('html', 8400, token);
    assert.match(block, /\/live\.js\?token=session%20token%26unsafe/);
    assert.equal(block.includes(token), false);
    assert.equal(removeTag(`${block}<main>Preview</main>\n`, 'html'), '<main>Preview</main>\n');
  });

  await t.test('subprocess invocation keeps the session token in one argument', async () => {
    const { buildScriptInvocation } = await import('./live.mjs');
    const token = 'session"; touch should-not-run; #';
    const invocation = buildScriptInvocation('/skills/impeccable/scripts', 'live-inject.mjs', [
      '--port', '8400',
      '--token', token,
    ]);

    assert.equal(invocation.executable, process.execPath);
    assert.deepEqual(invocation.args, [
      '/skills/impeccable/scripts/live-inject.mjs',
      '--port', '8400',
      '--token', token,
    ]);
  });
});
