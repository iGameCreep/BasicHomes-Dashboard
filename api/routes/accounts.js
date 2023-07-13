const express = require('express');
const router = express.Router();
const { hashPassword } = require('../utils/utils');
const headerMiddleware = require('../utils/headerMiddleware');

router.get('/account/:accountId', headerMiddleware, async (req, res) => {
    const accountId = req.params.accountId;
    const query = `SELECT * FROM accounts WHERE accountID = ${accountId}`;
    try {
      const result = await req.pool.query(query);
  
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      const user = result.rows[0];
  
      res.json({ accountID: accountId, userID: user.userid });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
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
});

module.exports = router;