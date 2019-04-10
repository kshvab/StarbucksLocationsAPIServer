const mongoose = require('mongoose');

const sblocationSchema = mongoose.Schema(
  {
    store_id: Number,
    country: String,
    first_seen: Date,
    street_combined: String,
    city: String,
    ownership_type: String,
    timezone: String,
    latitude: String,
    coordinates: {
      latitude: Number,
      needs_recoding: Boolean,
      longitude: Number
    },
    current_timezone_offset: Number,
    street_1: String,
    street_2: String,
    name: String,
    store_number: String,
    olson_timezone: String,
    phone_number: String,
    brand: String,
    country_subdivision: String,
    longitude: String
  },
  {
    timestamps: true
  }
);

let sblocation = mongoose.model('sblocation', sblocationSchema);

module.exports = sblocation;
