const movies = require('./data/movies')

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;

// static
app.use(express.static('public', { index: './documentation.html' }));

// logging
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'}) }));

// requests
app.get('/', (req, res) => {
  res.send('This is my movie API! There are many like it but this one is mine!');
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

// error logging
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
