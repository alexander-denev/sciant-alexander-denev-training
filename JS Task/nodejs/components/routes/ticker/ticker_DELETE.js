const express = require('express');
const router = express.Router();

router.delete('/:id', async (req, res) => {
  req.params.id;
});

module.exports = router;
