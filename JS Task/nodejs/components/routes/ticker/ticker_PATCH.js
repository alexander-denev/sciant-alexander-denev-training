const express = require('express');
const router = express.Router();

router.patch('/:id', async (req, res) => {
  req.params.id;
});

module.exports = router;
