const app = require('../backend/server.js');

module.exports = (req, res) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.substring(4);
  }
  return app(req, res);
};
