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
            res.status(400).send('Request error');
            return err;
          }
          if (obj.length) res.json(obj);
          else res.send('No data found!');
        });
      }
    }
  });
});

router.delete('/delete/:store_id', (req, res) => {
  apikey.findOne({ key: req.headers['authorization'] }, function(err, result) {
    if (err) {
      console.log('Problems with connecting to DB');
      res.status(500).send('Problems with connecting to DB');
    }
    if (result) deleteItem();
    else {
      res.status(401).send('Access denied,\na valid API key is Required!');
    }

    function deleteItem() {
      let store_id = req.params.store_id;
      sblocation.deleteOne({ store_id }, function(err, obj) {
        if (err) {
          console.log('I can not remove item from DB :(');
          res.status(400).send('Request error');
          return err;
        }
        if (obj.n) res.send('Item deleted successfully!');
        else res.send('This ID does not exist!');
      });
    }
  });
});

router.post('/add', (req, res) => {
  let store_id = req.query.store_id;

  apikey.findOne({ key: req.headers['authorization'] }, function(err, result) {
    if (err) {
      console.log('Problems with connecting to DB');
      res.status(500).send('Problems with connecting to DB');
    }
    if (result) existenceСheck();
    else {
      res.status(401).send('Access denied,\na valid API key is Required!');
    }

    function existenceСheck() {
      if (store_id) {
        sblocation.findOne({ store_id }, function(err, result) {
          if (err) {
            console.log('Problems with connecting to DB');
            res.status(500).send('Problems with connecting to DB');
          }
          if (result) {
            console.log(result);
            console.log('Such store_id already exists in the database.');
            res.send('Such store_id already exists in the database.');
          } else {
            addNewItem();
          }
        });
      } else {
        console.log('Request error');
        res.status(400).send('Request error');
        return err;
      }

      function addNewItem() {
        let newLocation = new sblocation(req.query);
        newLocation.save(function(err) {
          if (err) {
            console.log('I can not save Location to DB :(');
            res.status(500).send('Problems with connecting to DB');
            return err;
          } else {
            res.send('New location saved.');
          }
        });
      }
    }
  });
});

router.put('/update/:store_id', (req, res) => {
  let store_id = req.params.store_id;

  apikey.findOne({ key: req.headers['authorization'] }, function(err, result) {
    if (err) {
      console.log('Problems with connecting to DB');
      res.status(500).send('Problems with connecting to DB');
    }
    if (result) existenceСheck();
    else {
      res.status(401).send('Access denied,\na valid API key is Required!');
    }

    function existenceСheck() {
      if (store_id) {
        sblocation.updateOne({ store_id }, req.query, function(err, result) {
          if (err) {
            console.log('Request error');
            res.status(400).send('Request error');
            return;
          }

          if (!result.nModified) {
            console.log('This ID does not exist!');
            res.send('This ID does not exist!');
            return;
          }

          console.log('1 document updated');
          res.send('1 document updated!');
        });
      } else {
        console.log('Request error');
        res.status(400).send('Request error');
        return err;
      }
    }
  });
});

module.exports = router;
