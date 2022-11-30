const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Movie = require('./movie.js')

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMovies: [{ type: mongoose.ObjectId, ref: Movie }]
});

userSchema.statics.hashPassword = function(pw) {
  return bcrypt.hashSync(pw, 10);
};
userSchema.methods.validatePassword = function(pw) {
  return bcrypt.compareSync(pw, this.password);
};

module.exports = mongoose.model('User', userSchema);
