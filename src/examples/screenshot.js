const nightlink = require('../');
const puppeteer = require('puppeteer');

const run = async () => {
  // Start Tor (and waits till ready)
  const tor = await nightlink.launch({
    SocksPort: '9000'
  });

  // Start Chrome (and waits till ready)
  const browser = await puppeteer.launch({
    args: ['--proxy-server=socks5://127.0.0.1:9000']
  });

  // Browsing
  const page = await browser.newPage();
  await page.goto('https://3g2upl4pq6kufc4m.onion/');
  await page.screenshot({path: 'example.png'});

  console.log('screenshot captured')

  // Shutting down
  await browser.close();
  await tor.close();
}

run()
