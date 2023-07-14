const { defaultDb, getDbFromHash } = require('../db');

const checkHeaderMiddleware = (req, res, next) => {
  const header = req.headers['db'];
  if (header === 'default') {
    req.pool = defaultDb;
    return next();
  }
  if (header) {
    processDb(header, (error, result) => {
      if (error) return res.status(500).json({ error: 'Db processing error' });
      req.pool = result;
      next();
    })
  } else {
    res.status(400).json({ error: 'Missing header parameter' });
  }
};

function processDb(hash, callback) {
  const db = getDbFromHash(hash);
  callback(null, db);
}

module.exports = checkHeaderMiddleware;