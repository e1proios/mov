const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, min: 1890, required: true },
  description: String,
  director: {
    name: { type: String, required: true },
    nationality: String,
    birth: Number,
    death: Number
  },
  genre: {
    name: { type: String, required: true },
    description: String
  },
  featured: Boolean
});

module.exports = mongoose.model('Movie', movieSchema);
