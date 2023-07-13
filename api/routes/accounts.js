const express = require('express');
const router = express.Router();
const { hashPassword } = require('../utils/utils');

router.get('/account/:accountId', async (req, res) => {
    const accountId = req.params.accountId;
    const query = `SELECT * FROM accounts WHERE accountID = ${accountId}`;
    const servQuery = `SELECT * FROM account_servers WHERE accountID = ${accountId}`
    try {
      const result = await pool.query(query);
      const serverResult = await pool.query(servQuery);
  
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      if (serverResult.rows.length === 0) {
        res.status(404).json({ error: 'Servers not found' });
        return;
      }
  
      const user = result.rows[0];
      const servs = [];
      serverResult.rows.forEach(row => {
        servs.push({ serverID: row.serverid, serverName: row.servername, rank: row.rank })
      });
  
      res.json({ accountID: accountId, userID: user.userid, servers: servs });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
router.post('/account/delete', async (req, res) => {
    const accountId = req.body.accountId;
  
    if (!accountId) return res.status(400).json({ error: "account ID not provided" });
  
    const delAccSQL = `DELETE FROM accounts WHERE accountID = ${accountId}`;
    const delAccServSQL = `DELETE FROM account_servers WHERE accountID = ${accountId}`;
    const delSessionSQL = `DELETE FROM sessions WHERE accountID = ${accountId}`;
    try {
        await pool.query(delAccSQL);
        await pool.query(delAccServSQL);
        await pool.query(delSessionSQL);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
  
router.post('/account/password', async (req, res) => {
    const accountId = req.body.accountId;
    const password = req.body.password;
  
    if (!accountId) return res.status(400).json({ error: "accountId not provided" });
    if (!password) return res.status(400).json({ error: "password not provided" }); 
  
    const hashedPassword = hashPassword(password);
  
    const sql = `UPDATE accounts SET password = '${hashedPassword}' WHERE accountid = ${accountId}`;
    try {
        await pool.query(sql);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;