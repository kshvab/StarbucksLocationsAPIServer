const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.headers['authorization'] == 12345) {
    res.json(['Tony', 'Lisa', 'Michael', 'Ginger', 'Food']);
  } else res.status(401).send('Access denied,\na valid API key is Required!');

  console.log(req.headers['authorization']);
});

module.exports = router;
