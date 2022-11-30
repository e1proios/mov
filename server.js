const cors = require('cors');
const express = require('express');
const expressValidator = require('express-validator');
const body = expressValidator.body;
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const process = require('node:process');

const Movie = require('./models/movie.js');
const User = require('./models/user.js');

const setPassportConfig = require('./src/config/passport.js');
const setAuthRoutes = require('./src/auth.js');

const { ALLOWED_ORIGINS } = require('./src/config/cors.js');

const DEV = false;
const VERBOSE = true;

const app = express();
const port =  process.env.PORT || 8080;

setPassportConfig(passport);

const jsonParser = express.json();

let mongoAtlasUri;

if (DEV) {
  mongoAtlasUri = 'mongodb://localhost:27017/movie_db';
} else {
  mongoAtlasUri = process.env.mongoURL;
}

try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Mongoose is connected')
  );
} catch (e) {
  log('could not connect', 'error');
}

// set cors
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) {
        return cb(null, true);
      } else {
        if (ALLOWED_ORIGINS.length) {
          return ALLOWED_ORIGINS.includes(origin) ?
            cb(null, true) :
            cb(new Error(`CORS policy does not allow access from origin ${origin}`), false);
        } else {
          cb(null, true);
        }
      }
    }
  })
);

// set auth routes
setAuthRoutes(app);

// static
app.use(express.static(path.join(__dirname, 'public'), { index: './documentation.html' }));

// API hello
app.get('/hello', (req, res) => {
  res.status(200).send('API seems to be working');
});

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

// GET user by username/e-mail
app.get(
  '/users/:email',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOne({ email: req.params.email })
    .then(found => {
      if (found) {
        res.status(200).json(found);
      } else {
        res.status(404).send(`no user registered under ${req.params.email}`);
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
  [
    body('email', 'e-mail address is required').not().isEmpty(),
    body('email', 'e-mail address is not valid').isEmail(),
    body('password', 'password is required').not().isEmpty(),
    body('password', 'minimal password length: 8').isLength({ min: 8 }),
    body('name', 'username is required').not().isEmpty()
  ],
  (req, res) => {
    const errors = expressValidator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).send(`username ${req.body.email} already registered`);
      } else {
        User.create({
          name: req.body.name,
          email: req.body.email,
          birthday: req.body.birthday || null,
          password: User.hashPassword(req.body.password),
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
  '/users/:email',
  passport.authenticate('jwt', { session: false }),
  jsonParser,
  [
    body('email', 'e-mail is the primary user identifier and can not be changed').not().exists(),
    body('password', 'minimal password length: 8')
      .if(body('password').exists())
      .isLength({ min: 8 }),
    body('name', 'username can not be empty')
      .if(body('name').exists())
      .isLength({ min: 1 })
  ],
  (req, res) => {
    const errors = expressValidator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let updatedProps = { ...req.body};

    if (updatedProps.password) {
      updatedProps.password = User.hashPassword(updatedProps.password);
    }

    User.findOneAndUpdate(
      { email: req.params.email },
      { $set: updatedProps },
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
  '/users/:email/favorites',
  passport.authenticate('jwt', { session: false }),
  jsonParser,
  (req, res) => {
    User.findOneAndUpdate(
      { email: req.params.email },
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
  '/users/:email/favorites',
  passport.authenticate('jwt', { session: false }),
  jsonParser,
  (req, res) => {
    User.findOneAndUpdate(
      { email: req.params.email },
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
  '/users/:email',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOneAndDelete(
      { email: req.params.email },
    )
    .then(deletedUser => {
      if (!deletedUser) {
        res.status(400).send(`no user registered under ${req.params.email}`);
      } else {
        res.status(200).send(`user: ${deletedUser.name} was deleted`);
      }
    })
    .catch(e => {
      log(e, 'error')
      res.status(500).send('Error: ' + e);
    });
  }
);

app.listen(port, '0.0.0.0', () => {
  log(`Listening on port ${port}`);
});

function log(msg, severity) {
  if (VERBOSE) {
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

module.exports = app;
