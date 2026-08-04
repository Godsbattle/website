import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';

const validatorUrl = new URL('./live-event-safety.mjs', import.meta.url);

test('live identifiers accept generated IDs and reject unsafe forms', async () => {
  assert.equal(
    existsSync(validatorUrl),
    true,
    'shared live identifier validation is required',
  );

  const { isSafeLiveIdentifier } = await import(validatorUrl);

  for (const identifier of ['a1b2c3d4', 'session_42', 'event-42', '1']) {
    assert.equal(isSafeLiveIdentifier(identifier), true, `expected ${identifier} to be accepted`);
  }

  for (const identifier of [
    'event;touch-pwned',
    'event$(id)',
    'event|cat',
    'event 42',
    'event\n42',
    '../event',
    'folder/event',
    'folder\\event',
    '-e',
    '--help',
  ]) {
    assert.equal(isSafeLiveIdentifier(identifier), false, `expected ${identifier} to be rejected`);
  }
});
