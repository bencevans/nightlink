const which = require('which');

module.exports = (app) => {
  return new Promise((resolve, reject) => {
    which(app, (err, path) => {
      if (err) {
        return reject(err);
      }
      return resolve(path)
    })
  })
}