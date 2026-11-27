// The seed deletes data, so it only ever runs against a database on this machine.
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function assertLocalDatabase(url) {
  let host;
  try {
    host = new URL(url).hostname.replace(/^\[|\]$/g, '');
  } catch {
    throw new Error(`Refusing to touch a database with a malformed URL`);
  }
  if (!LOCAL_HOSTS.has(host)) throw new Error(`Refusing to touch a non-local database: ${host}`);
}

module.exports = { assertLocalDatabase };
