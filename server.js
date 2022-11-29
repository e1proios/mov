import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';

import { Movie } from './models/movie.js';
import { User } from './models/user.js';

import { setPassportConfig } from './src/passport.js';
import { setAuthRoutes } from './src/auth.js';

const DEBUG = true;

const app = express();
const port = 8080;

setPassportConfig(passport)

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonParser = express.json();

mongoose.connect('mongodb://localhost:27017/movie_db', { useNewUrlParser: true, useUnifiedTopology: true });

// set auth routes
setAuthRoutes(app);

// static
app.use(express.static('public', { index: './documentation.html' }));

// middleware: logging
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}) }));

// GET all movies
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movie.find()
    .then(allMovies => {
      res.status(200).json(allMovies);
    });
  }
);

// GET movie by title
app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movie.findOne({ title: req.params.title })
    .then(found => {
      if (found) {
        res.status(200).json(found);
      } else {
        res.status(404).send('movie not found');
      }
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    });
  }
);

// GET genre by name
app.get(
  '/genres/:name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movie.findOne({ 'genre.name': req.params.name })
    .then(found => {
      if (found) {
        res.status(200).json(found.genre);
      } else {
        res.status(404).send('genre not found');
      }
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    });
  }
);

// GET director by name
app.get(
  '/directors/:name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movie.findOne({ 'director.name': req.params.name })
    .then(found => {
      if (found) {
        res.status(200).json(found.director);
      } else {
        res.status(404).send('director not found');
      }
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    });
  }
);

// GET all users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.find()
    .then(allUsers => {
      res.status(200).json(allUsers);
    });
  }
);

// GET user by name
app.get(
  '/users/:name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOne({ name: req.params.name })
    .then(found => {
      if (found) {
        res.status(200).json(found);
      } else {
        res.status(404).send('no user with such name exists');
      }
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    })
  }
);

// POST register user
app.post(
  '/users',
  jsonParser,
  (req, res) => {
    User.findOne({ name: req.body.name })
    .then(user => {
      if (user) {
        return res.status(400).send(`user ${req.body.name} already exists`);
      } else {
        User.create({
          ...req.body,
          favoriteMovies: []
        })
        .then(newUser => {
          res.status(201).json(newUser);
        })
        .catch(e => {
          log(e, 'error')
          res.status(500).send('Error: ' + e);
        })
      }
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    });
  }
);

// PUT update user
app.put(
  '/users/:name',
  passport.authenticate('jwt', { session: false }),
  jsonParser,
  (req, res) => {
    User.findOneAndUpdate(
      { name: req.params.name },
      { $set: { ...req.body }},
      { new: true }
    )
    .then(updatedUser => {
      res.status(201).json(updatedUser);
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    });
  }
);

// PUT movie to user favorites
app.put(
  '/users/:name/favorites',
  passport.authenticate('jwt', { session: false }),
  jsonParser,
  (req, res) => {
    User.findOneAndUpdate(
      { name: req.params.name },
      { $addToSet: { favoriteMovies: mongoose.Types.ObjectId(req.body.movieId) }},
      { new: true }
    )
    .then(updatedUser => {
      res.status(201).json(updatedUser);
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    });
  }
);

// DELETE movie from user favorites
app.delete(
  '/users/:name/favorites',
  passport.authenticate('jwt', { session: false }),
  jsonParser,
  (req, res) => {
    User.findOneAndUpdate(
      { name: req.params.name },
      { $pull: { favoriteMovies: mongoose.Types.ObjectId(req.body.movieId) }},
      { new: true }
    )
    .then(updatedUser => {
      res.status(201).json(updatedUser);
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    });
  }
);

// DELETE user
app.delete(
  '/users/:name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOneAndDelete(
      { name: req.params.name },
    )
    .then(deletedUser => {
      if (!deletedUser) {
        res.status(400).send('no user with such name exists');
      } else {
        res.status(200).send(`user: ${req.params.name} was deleted`);
      }
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    });
  }
);

app.listen(port, () => {
  log(`Server running at http://localhost:${port}/`);
});

function log(msg, severity) {
  if (DEBUG) {
    switch (severity) {
      case 'error':
        console.error(msg);
        break;
      case 'warn':
        console.warn(msg);
        break;
      default:
        console.log(msg);
        break;
    }
  }
}
