const crypto = require('crypto');
const SESSION_ID_LENGTH = 16;

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

module.exports.hashPassword = hashPassword;

function generateSessionId() {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let sessionId = '';
  for (let i = 0; i < SESSION_ID_LENGTH; i++) {
    sessionId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return sessionId;
}

module.exports.generateSessionId = generateSessionId;