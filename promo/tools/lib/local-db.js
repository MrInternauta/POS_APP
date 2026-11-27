// The seed deletes data, so it only ever runs against a database and an API on this machine.
const { parse } = require('pg-connection-string');

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const bare = host => String(host).replace(/^\[|\]$/g, '');

function assertLocalDatabase(url) {
  let hosts;
  try {
    new URL(url); // pg-connection-string accepts almost anything; insist on a real URL first
    const cfg = parse(url);
    // pg lets ?host= and ?hostaddr= override the host in the URL, so check what pg will use
    hosts = [cfg.host, cfg.hostaddr].filter(Boolean).map(bare);
  } catch {
    throw new Error(`Refusing to touch a database with a malformed URL`);
  }
  const remote = hosts.find(h => !LOCAL_HOSTS.has(h)) ?? (hosts.length ? null : '(no host)');
  if (remote) throw new Error(`Refusing to touch a non-local database: ${remote}`);
}

// The demo data is written through the API, which writes to whatever database that backend uses
function assertLocalApi(url) {
  const host = bare(new URL(url).hostname);
  if (!LOCAL_HOSTS.has(host)) throw new Error(`Refusing to write demo data through a non-local API: ${host}`);
}

module.exports = { assertLocalDatabase, assertLocalApi };
