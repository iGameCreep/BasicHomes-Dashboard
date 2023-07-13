const express = require('express');
const router = express.Router();
const headerMiddleware = require('../utils/headerMiddleware');

router.get('/homes', headerMiddleware, async (req, res) => {
    try {
        const { rows } = await req.pool.query(`SELECT * FROM homes`);
        res.json(rows);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/homes/:userId', headerMiddleware, async (req, res) => {
    try {
        const { rows } = await req.pool.query(`SELECT * FROM homes WHERE uuid = '${req.params.userId}'`);
        res.json(rows);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/home/:homeId/delete', headerMiddleware, async (req, res) => {
  const homeId = req.params.homeId;
  
  try {
    req.pool.query(`DELETE FROM homes WHERE homeid = '${homeId}'`);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;