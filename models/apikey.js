const mongoose = require('mongoose');

const apikeySchema = mongoose.Schema(
  {
    key: String
  },
  {
    timestamps: true
  }
);

let apikey = mongoose.model('apikey', apikeySchema);

module.exports = apikey;
