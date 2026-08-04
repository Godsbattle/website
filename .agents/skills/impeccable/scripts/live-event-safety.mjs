const LIVE_IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

export function isSafeLiveIdentifier(value) {
  return typeof value === 'string' && LIVE_IDENTIFIER_PATTERN.test(value);
}
