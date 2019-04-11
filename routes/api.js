const express = require('express');
const router = express.Router();
const sblocation = require('../models/sblocation');
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

    function showData() {
      sblocation.find({}, function(err, obj) {
        if (err) {
          console.log('I can not get dataset from DB :(');
          return err;
        }
        res.json(obj);
      });
    }
  });

  console.log(req.headers['authorization']);
});

router.get('/filter', (req, res) => {
  apikey.findOne({ key: req.headers['authorization'] }, function(err, result) {
    if (err) {
      console.log('Problems with connecting to DB');
      res.status(500).send('Problems with connecting to DB');
    }
    if (result) showData();
    else {
      res.status(401).send('Access denied,\na valid API key is Required!');
    }

    function showData() {
      let userQuery;

      if (req.query.hasOwnProperty('store_id') && req.query.store_id)
        userQuery = JSON.parse('{ "store_id": "' + req.query.store_id + '" }');
      else if (req.query.hasOwnProperty('city') && req.query.city)
        userQuery = JSON.parse('{ "city": "' + req.query.city + '" }');
      else if (req.query.hasOwnProperty('country') && req.query.country)
        userQuery = JSON.parse('{ "country": "' + req.query.country + '" }');
      else {
        res.status(400).send('The request does not specify a filter!');
        return;
      }

      showFilteredData(userQuery);

      function showFilteredData(userQuery) {
        console.log(userQuery);
        sblocation.find(userQuery, function(err, obj) {
          if (err) {
            console.log('I can not get Filtered Dataset from DB :(');
            res.status(400).send('request error');
            return err;
          }
          if (obj.length) res.json(obj);
          else res.send('No data found!');
        });
      }
    }
  });

  console.log(req.headers['authorization']);
});

module.exports = router;
