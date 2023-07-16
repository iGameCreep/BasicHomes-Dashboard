const express = require('express');
const router = express.Router();
const headerMiddleware = require('../utils/headerMiddleware');

router.post('/db', headerMiddleware, async (req, res) => {
    const testSql = `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'rank');`
    const sql = `ALTER TABLE accounts ADD COLUMN rank text NOT NULL; \nUPDATE accounts SET rank = 'user';`

    req.pool.connect()
    .then(() => {
        req.pool.query(testSql, async (err, result) => {
            if (!result.rows[0].exists) await pool.query(sql);
            return res.json({ success: true });
        });
    })
    .catch(err => {
        if (err) return res.json({ success: false });
    });
});

module.exports = router;