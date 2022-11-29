import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { User } from '../models/user.js';

export function setPassportConfig(passport) {
  passport.use(new LocalStrategy(
    {
      usernameField: 'e-mail',
      passwordField: 'password'
    },
    function verify(email, password, callback) {
      User.findOne({ email: email, password })
      .then(user => {
        if (!user) {
          return callback(null, false, {message: 'Incorrect username or password.'});
        } else {
          return callback(null, user);
        }
      })
      .catch(err => {
        return callback(err);
      });
    })
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret'
      },
      function verify(jwtPayload, callback) {
        User.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error)
        });
      }
    )
  );
};
