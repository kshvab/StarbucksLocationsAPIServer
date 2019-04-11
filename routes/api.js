const express = require('express');
const router = express.Router();
const apikey = require('../models/apikey');

router.get('/', (req, res) => {
  apikey.findOne({ key: req.headers['authorization'] }, function(err, result) {
    if (err) {
      console.log('Problems with connecting to DB');
      res.status(500).send('Problems with connecting to DB');
    }
    if (result) showData();
    else {
      res.status(401).send('Access denied,\na valid API key is Required!');
    }
  });

  function showData() {
    // ******************** TO DO!!!!! have to show DATASET
    res.json(['Tony', 'Lisa', 'Michael', 'Ginger', 'Food']);
  }

  console.log(req.headers['authorization']);
});

module.exports = router;
