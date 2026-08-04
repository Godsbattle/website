import { realpathSync } from 'node:fs';
import path from 'node:path';

const PROTECTED_SCRIPT_PATHS = new Set([
  '/live.js',
  '/detect.js',
  '/modern-screenshot.js',
]);

export function isProtectedScriptPath(pathname) {
  return PROTECTED_SCRIPT_PATHS.has(pathname);
}

export function hasValidSessionToken(url, sessionToken) {
  return typeof sessionToken === 'string'
    && sessionToken.length > 0
    && url.searchParams.get('token') === sessionToken;
}

export function applyLoopbackCors(originHeader, response) {
  appendVaryOrigin(response);

  if (originHeader === undefined || originHeader === null || originHeader === '') {
    return true;
  }

  let origin;
  try {
    origin = new URL(originHeader);
  } catch {
    return false;
  }

  const isHttp = origin.protocol === 'http:' || origin.protocol === 'https:';
  const isLoopback = origin.hostname === 'localhost'
    || origin.hostname === '127.0.0.1'
    || origin.hostname === '[::1]';
  if (!isHttp || !isLoopback || origin.origin !== originHeader) return false;

  response.setHeader('Access-Control-Allow-Origin', originHeader);
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return true;
}

export function resolveProjectSourcePath(projectRoot, requestedPath) {
  if (typeof requestedPath !== 'string' || requestedPath.length === 0) return null;
  if (requestedPath.includes('\0')) return null;
  if (path.isAbsolute(requestedPath) || path.win32.isAbsolute(requestedPath)) return null;
  if (requestedPath.split(/[\\/]/).includes('..')) return null;

  const lexicalRoot = path.resolve(projectRoot);
  const lexicalPath = path.resolve(lexicalRoot, requestedPath);
  const lexicalRelativePath = path.relative(lexicalRoot, lexicalPath);
  if (
    lexicalRelativePath.length === 0
    || lexicalRelativePath === '..'
    || lexicalRelativePath.startsWith(`..${path.sep}`)
    || path.isAbsolute(lexicalRelativePath)
  ) {
    return null;
  }

  let resolvedRoot;
  let resolvedPath;
  try {
    resolvedRoot = realpathSync(lexicalRoot);
    resolvedPath = realpathSync(lexicalPath);
  } catch {
    return null;
  }

  const realRelativePath = path.relative(resolvedRoot, resolvedPath);
  if (
    realRelativePath.length === 0
    || realRelativePath === '..'
    || realRelativePath.startsWith(`..${path.sep}`)
    || path.isAbsolute(realRelativePath)
  ) {
    return null;
  }

  return resolvedPath;
}

function appendVaryOrigin(response) {
  const current = response.getHeader?.('Vary');
  if (!current) {
    response.setHeader('Vary', 'Origin');
    return;
  }

  const values = String(current).split(',').map((value) => value.trim().toLowerCase());
  if (!values.includes('origin')) response.setHeader('Vary', `${current}, Origin`);
}
