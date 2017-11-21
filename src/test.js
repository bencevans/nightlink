const launch = require('./').launch;
const ProxyAgent = require('proxy-agent');
const https = require('https');
const assert = require('assert');

const run = async () => {
  const tor = await launch({
    SocksPort: 9999
  });

  var opts = {
    method: 'GET',
    host: 'check.torproject.org',
    path: '/api/ip',
    agent: new ProxyAgent('socks://127.0.0.1:9999')
  };

  const onresponse = async (res) => {
    assert(res.statusCode === 200);
    res.setEncoding('utf8');

    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', async () => {
      const d = JSON.parse(body)
      assert(d.IsTor === true);
      await tor.close()
    });
  }

  // the rest works just like any other normal HTTP request 
  https.get(opts, onresponse);
}

run().catch(console.error)