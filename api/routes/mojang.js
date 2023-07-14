const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Get a Minecraft username from a Minecraft UUID using the Mojang API.
router.get('/mojang/username/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const url = `https://api.mojang.com/user/profile/${uuid}`;

        const response = await fetch(url);
        if (!response || !response.body) return;
        const data = await response.json();
        res.json(data.name)
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Get a Minecraft UUID from a Minecraft username using the Mojang API.
router.get('/mojang/uuid/:username', async (req, res) => {
  try {
      const username = req.params.username;
      const url = `https://api.mojang.com/users/profiles/minecraft/${username}`;

      const response = await fetch(url);
      if (!response || !response.body) return;
      const data = await response.json();
      res.json(data.id)
  }
  catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
});

module.exports = router;