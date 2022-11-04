import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { directors } from './data/directors.js';
import { genres } from './data/genres.js';
import { movies } from './data/movies.js';

const DEBUG = true;

const app = express();
const port = 8080;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonParser = express.json();

const users = [
  {
    id: 0,
    name: 'Peter Weyland',
    favorites: [ movies[1] ]
  }
];

// static
app.use(express.static('public', { index: './documentation.html' }));

// logging
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}) }));

// GET all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// GET movie by title
app.get('/movies/:title', (req, res) => {
  const found = movies.find(m => req.params.title === m.title);

  if (found) {
    res.status(200).json(found);
  } else {
    res.status(404).send('movie not found');
  }
});

// GET genre by name
app.get('/genres/:name', (req, res) => {
  const found = genres.find(g => req.params.name === g.name);

  if (found) {
    res.status(200).json(found);
  } else {
    res.status(404).send('genre not found');
  }
});

// GET director by name
app.get('/directors/:name', (req, res) => {
  const found = directors.find(d => req.params.name === d.name);

  if (found) {
    res.status(200).json(found);
  } else {
    res.status(404).send('director not found');
  }
});

// POST register user
app.post('/users', jsonParser, (req, res) => {
  if (req.body.name) {
    const newUser = new User(req.body.name, users.length);
    users.push(newUser);

    log(users);

    res.status(201).json(newUser);
  } else{
    res.status(400).send('missing required property: name');
  }
});

// PUT update user
app.put('/users/:id', jsonParser, (req, res) => {
  const targetId = Number(req.params.id);
  const foundUser = users.find(u => u.id === targetId);

  if (foundUser) {
    if (req.body.name) {
      foundUser.name = req.body.name;
      res.status(200).json(foundUser);
    } else {
      res.status(400).send('missing required property: name');
    }
  } else {
    res.status(404).send('user not found');
  }
});

// PUT movie to user favorites
app.put('/users/:id/favorites', jsonParser, (req, res) => {
  const targetUserId = Number(req.params.id);
  const foundUser = users.find(u => u.id === targetUserId);

  if (foundUser) {
    const targetMovieId = Number(req.body.movieId);

    if (targetId) {
      const foundMovie = movies.find(m => m.id === targetMovieId);

      if (!foundMovie) {
        res.status(404).send('movie not found');
      } else {
        foundUser.favorites.push(foundMovie);

        log(foundUser);

        res.status(200).send(`${foundMovie.title} added to user ${foundUser.name} favorites`);
      }
    } else {
      res.status(400).send('missing required property: movieId');
    }
  } else {
    res.status(404).send('user not found');
  }
});

// DELETE movie from user favorites
app.delete('/users/:id/favorites', jsonParser, (req, res) => {
  const targetUserId = Number(req.params.id);
  const foundUser = users.find(u => u.id === targetUserId);

  if (foundUser) {
    const targetMovieId = Number(req.body.movieId);

    if (targetMovieId) {
      const favoritesIndex = foundUser.favorites.findIndex(m => m.id === targetMovieId);

      if (favoritesIndex < 0) {
        res.status(404).send('movie not found');
      } else {
        const removedMovie = foundUser.favorites.splice(favoritesIndex, 1);

        log(foundUser);

        res.status(200).send(`${removedMovie[0].title} removed from user ${foundUser.name} favorites`);
      }
    } else {
      res.status(400).send('missing required property: movieId');
    }
  } else {
    res.status(404).send('user not found');
  }
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const targetUserId = Number(req.params.id);
  const foundUserIndex = users.findIndex(u => u.id === targetUserId);

  if (foundUserIndex) {
    const removedUser = users.splice(foundUserIndex, 1);

    log(users);

    res.status(200).send(`User: ${removedUser[0].name} - account closed`);
  } else {
    res.status(404).send('user not found');
  }
})

// error logging
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, () => {
  log(`Server running at http://localhost:${port}/`);
});

class User {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.favorites = [];
  }
}

function log(message) {
  if (DEBUG) {
    console.log(message);
  }
}
