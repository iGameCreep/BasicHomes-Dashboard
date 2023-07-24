const express = require('express');
const router = express.Router();
const { hashPassword } = require('../utils/utils');
const headerMiddleware = require('../utils/headerMiddleware');

async function getAccountById(id, pool) {
    const query = `SELECT * FROM accounts WHERE accountID = ${id}`;
    try {
      const result = await pool.query(query);
  
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
  
      return result.rows[0];
    } catch (error) {
      throw new Error('Error getting user:', error);
    }
}

router.get('/account/:accountId', headerMiddleware, async (req, res) => {
    const accountId = req.params.accountId;
    try {
      const user = await getAccountById(accountId, req.pool);

      res.json({ accountID: accountId, userID: user.userid, rank: user.rank });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    req.pool.end();
});

router.post('/account/:accountId/rank', headerMiddleware, async (req, res) => {
    const accountId = req.params.accountId;
    try {
      const user = await getAccountById(accountId, req.pool);

      await req.pool.query(`UPDATE accounts SET rank = '${user.rank === 'admin' ? 'user' : 'admin'}' WHERE accountid = ${accountId}`);

      res.sendStatus(200);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    req.pool.end();
});

router.get('/accounts', headerMiddleware, async (req, res) => {
    const query = `SELECT * FROM accounts`;
    try {
        const result = await req.pool.query(query);
        res.json(result.rows.map(({ accountid, userid, rank }) => ({ accountID: accountid, userID: userid, rank })));
    } catch (error) {
        console.error('Error getting accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    req.pool.end();
});
  
router.post('/account/delete', headerMiddleware, async (req, res) => {
    const accountId = req.body.accountId;
  
    if (!accountId) return res.status(400).json({ error: "account ID not provided" });
  
    const delAccSQL = `DELETE FROM accounts WHERE accountID = ${accountId}`;
    const delSessionSQL = `DELETE FROM sessions WHERE accountID = ${accountId}`;
    try {
        await req.pool.query(delAccSQL);
        await req.pool.query(delSessionSQL);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
    req.pool.end();
});
  
router.post('/account/password', headerMiddleware, async (req, res) => {
    const accountId = req.body.accountId;
    const password = req.body.password;
  
    if (!accountId) return res.status(400).json({ error: "accountId not provided" });
    if (!password) return res.status(400).json({ error: "password not provided" }); 
  
    const hashedPassword = hashPassword(password);
  
    const sql = `UPDATE accounts SET password = '${hashedPassword}' WHERE accountid = ${accountId}`;
    try {
        await req.pool.query(sql);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
    req.pool.end();
});

module.exports = router;