const { Pool } = require('pg');
const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;
const allowedDomain = `${process.env.WEBSITE_DOMAIN}:${process.env.WEBSITE_PORT}`; // The dashboard url
const SESSION_ID_LENGTH = 16;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Only allow requests from the allowedDomain var, by default localhost with port 4200.
app.use(cors({ origin: allowedDomain }));

// Set up a connection pool for PostgreSQL
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432, 
});

// Homes
app.get('/homes/:serverId', async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM homes_${req.params.serverId.replaceAll("-", "")}`);
        res.json(rows);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/homes/:serverId/:userId', async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM homes_${req.params.serverId} WHERE uuid = '${req.params.userId}'`);
        res.json(rows);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/home/:serverId/:homeId/delete', async (req, res) => {
  const serverId = req.params.serverId;
  const homeId = req.params.homeId;
  
  try {
    pool.query(`DELETE FROM homes_${serverId.replaceAll('-', '')} WHERE homeid = '${homeId}'`);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

// Get a Minecraft username from a Minecraft UUID using the Mojang API.
app.get('/mojang/username/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const url = `https://api.mojang.com/user/profile/${uuid}`;

        const response = await fetch(url);
        if (!response || !response.body) return;
        const body = response.body;
        res.json(JSON.parse(body._readableState.buffer.head.data.toString('ascii')).name)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Get a Minecraft UUID from a Minecraft username using the Mojang API.
app.get('/mojang/uuid/:username', async (req, res) => {
  try {
      const username = req.params.username;
      const url = `https://api.mojang.com/users/profiles/minecraft/${username}`;

      const response = await fetch(url);
      if (!response || !response.body) return;
      const body = response.body;
      res.json(JSON.parse(body._readableState.buffer.head.data.toString('ascii')).id)
  }
  catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
});

// Accounts
app.get('/account/:accountId', async (req, res) => {
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

app.post('/account/delete', async (req, res) => {
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
})

app.post('/account/password', async (req, res) => {
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
})

app.post('/server/:uuid', async (req, res) => {
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
})

// Sessions / Accounts related
app.post('/api/login', async (req, res) => {
  const accountId = Number(req.body.accountId);
  const password = req.body.password;
  pool.query('SELECT password FROM accounts WHERE accountID = $1', [accountId], async (err, result) => {
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
          await pool.query('INSERT INTO sessions (token, accountID) VALUES ($1, $2)', [sessionID, accountId]);
          res.status(200).json({ success: true, sessionID, userID: accountId });
        } else {
          res.json({ success: false, message: 'Incorrect password' });
        }
      }
    }
  });
});

app.post('/api/session', (req, res) => {
  const sessionId = req.body.sessionId;

  if (!sessionId) {
    res.status(400).send("Session not provided");
    return;
  }

  // Query the session table in the database to check if the session exists
  const query = `SELECT * FROM sessions WHERE token = '${sessionId}'`;
  pool.query(query, (err, result) => {
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
});

app.post('/api/session/destroy', (req, res) => {
  const sessionId = req.body.sessionId;

  if (!sessionId) {
    res.status(400).send("Session not provided");
    return;
  }

  // Query the session table in the database to check if the session exists
  const query = `SELECT * FROM sessions WHERE token = '${sessionId}'`;
  pool.query(query, async (err, result) => {
    try {
      await pool.query(`DELETE FROM sessions WHERE token = '${sessionId}'`);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Error deleting session" });
    }
  });
})

function removeExpiredSessions() {
  const currentTime = new Date().getTime();
  const query = `DELETE FROM sessions WHERE expireAt <= to_timestamp(${currentTime / 1000})`;
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error removing expired sessions', err);
      return;
    }
  });
}

// Call the removeExpiredSessions function every 5 minutes
setInterval(removeExpiredSessions, 5 * 60 * 1000);

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

function generateSessionId() {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let sessionId = '';
  for (let i = 0; i < SESSION_ID_LENGTH; i++) {
    sessionId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return sessionId;
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});