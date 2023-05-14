const { Pool } = require('pg');
const cors = require('cors');
const { Request, Response } = require('express');
const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;
const allowedPort = 4200;

// Only allow requests from the allowedPort var, the angular default port is 4200.
app.use(cors({ origin: `http://localhost:${allowedPort}` }));

// Set up a connection pool for PostgreSQL
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432, 
});

// Define an endpoint to retrieve all users from the database
app.get('/tables', async (req, res) => {
  try {
    const sql = `SELECT table_schema || '.' || table_name as show_tables
                FROM
                    information_schema.tables
                WHERE
                    table_type = 'BASE TABLE'
                AND
                    table_schema NOT IN ('pg_catalog', 'information_schema');`
    const { rows } = await pool.query(sql);
    const homesTables = [];
    rows.forEach(row => {
        if (row.show_tables.startsWith("public.homes_")) {
            homesTables.push(row);
        };
    });
    res.json(homesTables);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

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

// Get a Minecraft username from a Minecraft UUID using the Mojang API.
app.get('/mojang/username/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const url = `https://api.mojang.com/user/profile/${uuid}?needReadable=true`;

        const response = await fetch(url);
        if (!response || !response.body) return;
        const body = response.body;
        res.json(JSON.parse(body._readableState.buffer.head.data.toString('ascii')).name)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});