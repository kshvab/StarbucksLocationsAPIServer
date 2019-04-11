const express = require('express');
const router = express.Router();
const request = require('request');
const sblocation = require('../models/sblocation');
const apikey = require('../models/apikey');
const uuidv1 = require('uuid/v1');

router.get('/updatedataset', function(req, res) {
  const url = 'https://opendata.socrata.com/resource/xy4y-c4mk.json';

  request(url, function(error, response, dataSetJson) {
    if (error) {
      console.log(error);
      res.send(error);
      return;
    }

    let dataSetObj = JSON.parse(dataSetJson);
    clearDb(dataSetObj);
  });

  function clearDb(dataSetObj) {
    sblocation.remove({}, function(err, obj) {
      if (err) {
        console.log('I can not clear the DB :(');
        return err;
      }
      updateDb(dataSetObj);
    });
  }

  function updateDb(obj) {
    for (let i = 0; i < obj.length; i++) {
      let newLocation = new sblocation(obj[i]);
      newLocation.save(function(err) {
        if (err) {
          console.log('I can not save Location to DB :(');
          return err;
        }
      });
    }
    console.log('The database has been updated');
    res.send('The database has been updated');
  }
});

router.get('/givemeapikey', function(req, res) {
  if (req.headers['authorization'] == 'apitalks') {
    createNewUser();
  } else res.status(401).send('Access denied,\na valid administrator Header is Required!');

  function createNewUser() {
    let generatedApiKey = uuidv1();
    console.log(generatedApiKey);

    let newApiKey = new apikey({ key: generatedApiKey });
    newApiKey.save(function(err) {
      if (err) {
        console.log('I can not save new Api Key to DB :(');
        return err;
      }
      res.send('New API-key generated: ' + generatedApiKey);
    });
  }
});
module.exports = router;
