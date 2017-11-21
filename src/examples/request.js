var http = require('http');
var ProxyAgent = require('proxy-agent');
var nightlink = require('../');

const run = async () => {
  const tor = await nightlink.launch({
    SocksPort: 9000
  });

  var proxyUri = process.env.http_proxy || 'socks://127.0.0.1:9000';

  var opts = {
    method: 'GET',
    host: 'jsonip.org',
    path: '/',
    agent: new ProxyAgent(proxyUri)
  };

  const onresponse = async (res) => {
    console.log(res.statusCode, res.headers);
    res.pipe(process.stdout);

    await tor.close()
  }

  // the rest works just like any other normal HTTP request 
  http.get(opts, onresponse);
}


run()