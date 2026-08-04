import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const injectScript = fileURLToPath(new URL('./live-inject.mjs', import.meta.url));

function config(files) {
  return {
    files,
    insertBefore: '</body>',
    commentSyntax: 'html',
    cspChecked: true,
  };
}

function write(relativeRoot, relativePath, content) {
  const destination = path.join(relativeRoot, relativePath);
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, content, 'utf8');
  return destination;
}

function runInject(projectRoot, configPath, args) {
  return spawnSync(process.execPath, [injectScript, ...args], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      IMPECCABLE_LIVE_CONFIG: configPath,
    },
  });
}

test('live injection resolves only canonical in-project targets', async (t) => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-inject-'));
  const projectRoot = path.join(fixtureRoot, 'project');
  const siblingRoot = path.join(fixtureRoot, 'project-other');
  const outsideRoot = path.join(fixtureRoot, 'outside');

  try {
    mkdirSync(projectRoot);
    write(siblingRoot, 'page.html', '<body>Sibling</body>\n');
    write(outsideRoot, 'page.html', '<body>Outside</body>\n');
    symlinkSync(outsideRoot, path.join(projectRoot, 'linked-outside'), 'dir');
    write(projectRoot, 'node_modules/vendor/page.html', '<body>Vendor</body>\n');
    symlinkSync(
      path.join(projectRoot, 'node_modules', 'vendor'),
      path.join(projectRoot, 'vendor-link'),
      'dir',
    );

    const { resolveFiles } = await import('./live-inject.mjs');
    const unsafeCases = [
      ['absolute target', path.join(outsideRoot, 'page.html'), /must stay inside/],
      ['absolute glob', path.join(outsideRoot, '*.html'), /must stay inside/],
      ['Windows absolute target', 'C:\\outside\\page.html', /must stay inside/],
      ['parent traversal target', '../outside/page.html', /must stay inside/],
      ['sibling-prefix target', '../project-other/page.html', /must stay inside/],
      ['out-of-root glob', '../outside/*.html', /must stay inside/],
      ['symlink-escape literal', 'linked-outside/page.html', /must stay inside/],
      ['symlink-escape glob', 'linked-outside/*.html', /must stay inside/],
      ['hard-excluded literal', 'node_modules/vendor/index.html', /is hard-excluded/],
      ['hard-excluded git literal', '.git/config', /is hard-excluded/],
      ['case-insensitive hard-excluded literal', 'NODE_MODULES/vendor/page.html', /is hard-excluded/],
      ['canonical hard-exclude symlink alias', 'vendor-link/page.html', /is hard-excluded/],
    ];

    for (const [label, target, expectedError] of unsafeCases) {
      await t.test(label, () => {
        assert.throws(
          () => resolveFiles(projectRoot, config([target])),
          expectedError,
        );
      });
    }
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('insert rejects an out-of-root glob before touching safe or outside files', () => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-insert-'));
  const projectRoot = path.join(fixtureRoot, 'project');
  const outsidePath = write(fixtureRoot, 'outside/page.html', '<body>Outside</body>\n');
  const safePath = write(projectRoot, 'index.html', '<body>Safe</body>\n');
  const configPath = write(
    fixtureRoot,
    'config.json',
    `${JSON.stringify(config(['index.html', '../outside/*.html']))}\n`,
  );
  const safeBefore = readFileSync(safePath, 'utf8');
  const outsideBefore = readFileSync(outsidePath, 'utf8');

  try {
    const result = runInject(projectRoot, configPath, [
      '--port', '8400',
      '--token', 'session-token',
    ]);
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(safePath, 'utf8'), safeBefore);
    assert.equal(readFileSync(outsidePath, 'utf8'), outsideBefore);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('remove rejects a symlink escape before touching safe or outside files', () => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-remove-'));
  const projectRoot = path.join(fixtureRoot, 'project');
  const injected = [
    '<body>',
    '<!-- impeccable-live-start -->',
    '<script src="http://localhost:8400/live.js?token=session-token"></script>',
    '<!-- impeccable-live-end -->',
    '</body>',
    '',
  ].join('\n');
  const outsidePath = write(fixtureRoot, 'outside/page.html', injected);
  const safePath = write(projectRoot, 'index.html', injected);
  symlinkSync(path.join(fixtureRoot, 'outside'), path.join(projectRoot, 'linked-outside'), 'dir');
  const configPath = write(
    fixtureRoot,
    'config.json',
    `${JSON.stringify(config(['index.html', 'linked-outside/page.html']))}\n`,
  );

  try {
    const result = runInject(projectRoot, configPath, ['--remove']);
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(safePath, 'utf8'), injected);
    assert.equal(readFileSync(outsidePath, 'utf8'), injected);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('insert preflights every target before writing when one file is missing', () => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-insert-preflight-'));
  const projectRoot = path.join(fixtureRoot, 'project');
  const original = '<body>Safe</body>\n';
  const safePath = write(projectRoot, 'index.html', original);
  const configPath = write(
    fixtureRoot,
    'config.json',
    `${JSON.stringify(config(['index.html', 'missing.html']))}\n`,
  );

  try {
    const result = runInject(projectRoot, configPath, [
      '--port', '8400',
      '--token', 'session-token',
    ]);
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(safePath, 'utf8'), original);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('insert preflights every transformation before writing when one anchor is missing', () => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-anchor-preflight-'));
  const projectRoot = path.join(fixtureRoot, 'project');
  const original = '<body>Safe</body>\n';
  const safePath = write(projectRoot, 'index.html', original);
  const invalidPath = write(projectRoot, 'no-anchor.html', '<main>No body anchor</main>\n');
  const invalidBefore = readFileSync(invalidPath, 'utf8');
  const configPath = write(
    fixtureRoot,
    'config.json',
    `${JSON.stringify(config(['index.html', 'no-anchor.html']))}\n`,
  );

  try {
    const result = runInject(projectRoot, configPath, [
      '--port', '8400',
      '--token', 'session-token',
    ]);
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(safePath, 'utf8'), original);
    assert.equal(readFileSync(invalidPath, 'utf8'), invalidBefore);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('remove preflights every target before writing when one file is missing', () => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-remove-preflight-'));
  const projectRoot = path.join(fixtureRoot, 'project');
  const injected = [
    '<body>',
    '<!-- impeccable-live-start -->',
    '<script src="http://localhost:8400/live.js?token=session-token"></script>',
    '<!-- impeccable-live-end -->',
    '</body>',
    '',
  ].join('\n');
  const safePath = write(projectRoot, 'index.html', injected);
  const configPath = write(
    fixtureRoot,
    'config.json',
    `${JSON.stringify(config(['index.html', 'missing.html']))}\n`,
  );

  try {
    const result = runInject(projectRoot, configPath, ['--remove']);
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(safePath, 'utf8'), injected);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('write transaction rolls back attempted updates after a later write fails', async () => {
  const { commitFileUpdates } = await import('./live-inject.mjs');
  const contents = new Map([
    ['/one.html', 'original one'],
    ['/two.html', 'original two'],
  ]);
  const updates = [
    { absolutePath: '/one.html', originalContent: 'original one', updatedContent: 'updated one' },
    { absolutePath: '/two.html', originalContent: 'original two', updatedContent: 'updated two' },
  ];

  assert.throws(
    () => commitFileUpdates(updates, (file, content) => {
      if (content === 'updated two') throw new Error('simulated write failure');
      contents.set(file, content);
    }),
    /simulated write failure/,
  );
  assert.equal(contents.get('/one.html'), 'original one');
  assert.equal(contents.get('/two.html'), 'original two');
});

test('valid literal and glob targets insert and remove within the project', () => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-valid-'));
  const projectRoot = path.join(fixtureRoot, 'project');
  const original = '<body>Safe</body>\n';
  const literalPath = write(projectRoot, 'index.html', original);
  const globPath = write(projectRoot, 'pages/about.html', original);
  write(projectRoot, 'node_modules/vendor/index.html', original);
  const configPath = write(
    fixtureRoot,
    'config.json',
    `${JSON.stringify(config(['index.html', 'pages/*.html']))}\n`,
  );

  try {
    const inserted = runInject(projectRoot, configPath, [
      '--port', '8400',
      '--token', 'session-token',
    ]);
    assert.equal(inserted.status, 0, inserted.stderr);
    assert.match(readFileSync(literalPath, 'utf8'), /impeccable-live-start/);
    assert.match(readFileSync(globPath, 'utf8'), /impeccable-live-start/);

    const removed = runInject(projectRoot, configPath, ['--remove']);
    assert.equal(removed.status, 0, removed.stderr);
    assert.equal(readFileSync(literalPath, 'utf8'), original);
    assert.equal(readFileSync(globPath, 'utf8'), original);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('default config lives in ignored project runtime state and prepares its parent', () => {
  const projectRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-config-'));
  const expectedPath = path.join(realpathSync(projectRoot), '.impeccable-live', 'config.json');

  try {
    const result = spawnSync(process.execPath, [injectScript, '--check'], {
      cwd: projectRoot,
      encoding: 'utf8',
      env: Object.fromEntries(
        Object.entries(process.env).filter(([key]) => key !== 'IMPECCABLE_LIVE_CONFIG'),
      ),
    });
    assert.equal(result.status, 0);
    const output = JSON.parse(result.stdout);
    assert.equal(output.error, 'config_missing');
    assert.equal(output.path, expectedPath);
    assert.equal(existsSync(path.dirname(expectedPath)), true);
    assert.equal(existsSync(expectedPath), false);
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
  }
});

test('default config rejects a parent symlink that escapes the project', () => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-config-escape-'));
  const projectRoot = path.join(fixtureRoot, 'project');
  const outsideRoot = path.join(fixtureRoot, 'outside');
  mkdirSync(projectRoot);
  mkdirSync(outsideRoot);
  symlinkSync(outsideRoot, path.join(projectRoot, '.impeccable-live'), 'dir');

  try {
    const result = spawnSync(process.execPath, [injectScript, '--check'], {
      cwd: projectRoot,
      encoding: 'utf8',
      env: Object.fromEntries(
        Object.entries(process.env).filter(([key]) => key !== 'IMPECCABLE_LIVE_CONFIG'),
      ),
    });
    assert.notEqual(result.status, 0);
    assert.equal(existsSync(path.join(outsideRoot, 'config.json')), false);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('explicit config override remains supported and prepares its parent', () => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'impeccable-config-override-'));
  const projectRoot = path.join(fixtureRoot, 'project');
  const overridePath = path.join(fixtureRoot, 'trusted-operator-state', 'live.json');
  mkdirSync(projectRoot);

  try {
    const result = spawnSync(process.execPath, [injectScript, '--check'], {
      cwd: projectRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        IMPECCABLE_LIVE_CONFIG: overridePath,
      },
    });
    assert.equal(result.status, 0);
    const output = JSON.parse(result.stdout);
    assert.equal(output.error, 'config_missing');
    assert.equal(output.path, overridePath);
    assert.equal(existsSync(path.dirname(overridePath)), true);
    assert.equal(existsSync(overridePath), false);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('insertAfter preserves adjacent content and removes byte-for-byte', async (t) => {
  const { insertTag, removeTag } = await import('./live-inject.mjs');
  const insertAfterConfig = {
    files: ['index.html'],
    insertAfter: '<head>',
    commentSyntax: 'html',
  };

  for (const original of ['<head><title>Title</title>', '<head>\n<title>Title</title>']) {
    await t.test(JSON.stringify(original), () => {
      const inserted = insertTag(original, insertAfterConfig, 8400, 'session-token');
      assert.match(inserted, /impeccable-live-start/);
      assert.match(inserted, /<title>Title<\/title>/);
      assert.equal(removeTag(inserted, 'html'), original);
    });
  }
});

test('failed injection stops only a newly started server without removing markup', async () => {
  const { stopStartedServer } = await import('./live.mjs');
  const calls = [];
  const runner = (name, args) => calls.push({ name, args });

  assert.equal(stopStartedServer({ started: true }, runner), true);
  assert.deepEqual(calls, [{ name: 'live-server.mjs', args: ['stop', '--keep-inject'] }]);

  calls.length = 0;
  assert.equal(stopStartedServer({ started: false }, runner), false);
  assert.deepEqual(calls, []);
});

test('post-injection setup cleanup removes markup but stops only an owned server', async () => {
  const { cleanupInjectedSetup } = await import('./live.mjs');
  const calls = [];
  const runner = (name, args) => calls.push({ name, args });

  assert.deepEqual(
    cleanupInjectedSetup({ started: true }, runner),
    { removedInjection: true, stoppedNewServer: true },
  );
  assert.deepEqual(calls, [
    { name: 'live-inject.mjs', args: ['--remove'] },
    { name: 'live-server.mjs', args: ['stop', '--keep-inject'] },
  ]);

  calls.length = 0;
  assert.deepEqual(
    cleanupInjectedSetup({ started: false }, runner),
    { removedInjection: true, stoppedNewServer: false },
  );
  assert.deepEqual(calls, [{ name: 'live-inject.mjs', args: ['--remove'] }]);
});

test('post-injection cleanup reports remove and stop failures independently', async () => {
  const { cleanupInjectedSetup } = await import('./live.mjs');
  const calls = [];
  const runner = (name, args) => {
    calls.push({ name, args });
    if (name === 'live-inject.mjs') throw new Error('remove failed');
  };

  assert.deepEqual(
    cleanupInjectedSetup({ started: true }, runner),
    { removedInjection: false, stoppedNewServer: true },
  );
  assert.deepEqual(calls, [
    { name: 'live-inject.mjs', args: ['--remove'] },
    { name: 'live-server.mjs', args: ['stop', '--keep-inject'] },
  ]);
});
