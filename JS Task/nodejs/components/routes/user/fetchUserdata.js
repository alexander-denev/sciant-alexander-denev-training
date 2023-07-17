const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.authObject.userId;
  
  try {
    const queryResult = await req.pool.query('SELECT userdata FROM users WHERE id = $1', [userId]);
    res.status(200).json({ userData: queryResult.rows[0].userdata });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
