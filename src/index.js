const EventEmitter = require('events');
const path = require('path');
const which = require('./lib/p-which');
const spawn = require('child_process').spawn;
const split = require('split');

const onceEvent = (ee, name) => {
  return new Promise((resolve) => {
    ee.once(name, resolve);
  })
}

const launch = async (uopts = {}) => {
  const args = Object.assign({
    path: uopts.torPath || await which('tor'),
    args: uopts.args || [
      '--SocksPort', uopts.SocksPort || '9050'
    ]
  }, uopts)

  const ps = spawn(args.path, args.args);
  const nl = new Nightlink(ps)

  await nl.waitForReady();
  return nl;
}

class Nightlink extends EventEmitter {
  constructor(ps) {
    super();

    this.ps = ps;
    this.isReady = false;
    this.isClosed = false;

    /**
     * LOG HANDLING
     * 
     * Every new line written to stdout by Tor is emitted as a `log` event.
     * The value is a hash with `level` and `msg` keys.
     * 
     * Known levels:
     *  - notice
     *  - warn
     *  - err
     */
    ps.stdout
      .pipe(split())
      .on('data', line => {
        const match = line.match(/\[(.+)\] (.+)/);
        if (!match) {
          return;
        }
        const level = match[1];
        const msg = match[2];
        this.emit('log', {level, msg});
        this.emit(level, msg);
      });

    /**
     * Look for ready message
     */
    const readyListener = this.on('notice', (msg) => {
      if (msg === 'Tor has successfully opened a circuit. Looks like client functionality is working.') {
        this.isReady = true;
        this.emit('ready');
      }
    })

    ps.once('close', () => {
      this.isClosed = true;
    });
  }

  async waitForReady() {
    if (!this.isReady) {
      await onceEvent(this, 'ready');
    }
    return true;
  }

  async close() {
    if (!this.isClosed) {
      this.ps.kill()
      await onceEvent(this.ps, 'close')
    }
    return true;
  }
}

module.exports = {launch}