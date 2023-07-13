const pool = require('./db');

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