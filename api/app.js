const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

require('./sessionChecker'); // Remove old sessions from DB

const app = express();
const port = process.env.API_PORT || 3000;
const allowedDomain = `${process.env.WEBSITE_DOMAIN}:${process.env.WEBSITE_PORT}`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Only allow requests from the allowedDomain var, by default localhost with port 4200.
app.use(cors({ origin: allowedDomain }));

// Dynamically load routes
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(file => {
  const route = require(path.join(routesPath, file));
  app.use('/', route);
  console.log(`[Loaded Routes] ${file.split('.')[0]}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});