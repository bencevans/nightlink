# Nightlink [![CircleCI](https://circleci.com/gh/bencevans/nightlink.svg?style=svg)](https://circleci.com/gh/bencevans/nightlink)

> Start and control a Tor instance.

## Install

    $ npm install --save nightlink

## Usage

### Basic

```js
const nightlink = require('nightlink');

const tor = await nightlink.launch({
  SocksPort: 9050
});

// Tor has started and connected to the network.

await tor.close();
```

### Logs

```js
tor.on('log', {level, msg} => {
  console.log(`[${level}] ${msg}`);
})
```

### Logs by level

```js
tor.on('notice', console.log);
tor.on('warn', console.log);
tor.on('err', console.error);
```

## Examples

* [Start Tor, make a HTTP request and shutdown](./src/examples/request.js)
* [Start Tor, start Chrome, screenshot URL and shutdown](./src/examples/screenshot.js)

## API

### nightlink.launch([options])


#### options

Type: `object`

Define options to be used.

##### SocksPort

Type: Number

Define port Tor should start the SOCKS proxy on.

#### .close()

#### .on('log', callback)
#### .on('notice', callback)
#### .on('warn', callback)
#### .on('err', callback)

## Licence

MIT © [Ben Evans](https://bencevans.io)