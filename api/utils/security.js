

const restrictAdmin = (req, res, next) => {
  const session = req.headers['session'];
  if (!session) return res.sendStatus(403);
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

module.exports.restrictAdmin = restrictAdmin;