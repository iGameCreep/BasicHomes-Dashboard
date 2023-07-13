const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/homes/:serverId', async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM homes_${req.params.serverId.replaceAll("-", "")}`);
        res.json(rows);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/homes/:serverId/:userId', async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM homes_${req.params.serverId} WHERE uuid = '${req.params.userId}'`);
        res.json(rows);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/home/:serverId/:homeId/delete', async (req, res) => {
  const serverId = req.params.serverId;
  const homeId = req.params.homeId;
  
  try {
    pool.query(`DELETE FROM homes_${serverId.replaceAll('-', '')} WHERE homeid = '${homeId}'`);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;