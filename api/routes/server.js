const express = require('express');
const router = express.Router();

router.post('/server/:uuid', async (req, res) => {
  const name = req.body.name;
  const accId = req.body.accId;
  const uuid = req.params.uuid;
  const query = `UPDATE account_servers SET serverName = '${name}' WHERE serverID = '${uuid}' AND accountID = ${accId}`;

  try {
    await pool.query(query);
  } catch (error) {
    console.error('Error changing server name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;