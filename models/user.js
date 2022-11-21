import mongoose, { model, Schema } from 'mongoose';
import { Movie } from './movie.js';

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMovies: [{ type: mongoose.ObjectId, ref: Movie }]
});

export const User = model('User', userSchema);
