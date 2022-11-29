import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import passport from 'passport';

const jsonParser = express.json();
const jwtSecret = 'your_jwt_secret';

function generateJWTToken(user) {
  return jsonwebtoken.sign(user, jwtSecret, {
    subject: user.email,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
}

export function setAuthRoutes(router) {
  router.post('/login', jsonParser, (req, res) => {
    passport.authenticate('local', { session: false }, (error, user) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'login failed',
          user: user
        });
      } else {
        req.login(user, { session: false }, (error) => {
          if (error) {
            res.send(error);
          } else {
            const token = generateJWTToken(user.toJSON());
            return res.json({ user, token });
          }
        });
      }
    })(req, res);
  });
};
