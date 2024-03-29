const express = require('express');
const router = express.Router();
const { hashPassword, generateSessionId } = require('../utils/utils');
const headerMiddleware = require('../utils/headerMiddleware');

router.post('/api/login', headerMiddleware, async (req, res) => {
  const accountId = Number(req.body.accountId);
  const password = req.body.password;
  req.pool.query('SELECT password FROM accounts WHERE accountID = $1', [accountId], async (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      if (result.rows.length === 0) {
        res.json({ success: false, message: 'Invalid accountID' });
      } else {
        const storedHash = result.rows[0].password;
        const inputHash = hashPassword(password);
        if (storedHash === inputHash) {
          const sessionID = generateSessionId();
          await req.pool.query('INSERT INTO sessions (token, accountID) VALUES ($1, $2)', [sessionID, accountId]);
          res.status(200).json({ success: true, sessionID, userID: accountId });
          req.pool.end();
        } else {
          res.json({ success: false, message: 'Incorrect password' });
        }
      }
    }
  });
});

router.post('/api/session', headerMiddleware, (req, res) => {
  const sessionId = req.body.sessionId;

  if (!sessionId) {
    res.status(400).send("Session not provided");
    return;
  }

  // Query the session table in the database to check if the session exists
  const query = `SELECT * FROM sessions WHERE token = '${sessionId}'`;
  req.pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error checking session');
      return;
    }

    // If the session is not found or has expired, return a JSON response indicating it is unavailable
    const session = result.rows[0];

    if (!session || new Date(session.expireat) < new Date()) {
      res.json({ available: false, accountID: (session ? session.accountid : -1) });
      return;
    }

    // If the session is still available, return the corresponding accountId with a JSON response
    const accountId = session.accountid;
    res.json({ available: true, accountID: accountId });
  });
  req.pool.end();
});

router.post('/api/session/destroy', headerMiddleware, (req, res) => {
  const sessionId = req.body.sessionId;

  if (!sessionId) {
    res.status(400).send("Session not provided");
    return;
  }

  // Query the session table in the database to check if the session exists
  const query = `SELECT * FROM sessions WHERE token = '${sessionId}'`;
  req.pool.query(query, async (err, result) => {
    try {
      await req.pool.query(`DELETE FROM sessions WHERE token = '${sessionId}'`);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Error deleting session" });
    }
  });
  req.pool.end();
});

module.exports = router;