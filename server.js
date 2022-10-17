const fs = require('fs');
const http = require('http');
const url = require('url');

const port = 8080;
let stream;

const server = http.createServer((req, res) => {
  let path = url.parse(req.url, true);
  let fn;

  stream.write(`${Date.now()}: ${req.url}\n`);

  if (path.pathname.includes('documentation')) {
    fn = './documentation.html';
  } else {
    fn = './index.html';
  }
  fs.readFile(fn, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

server.listen(port, undefined, () => {
  console.log(`Server running at http://localhost:${port}/`);
  stream = fs.createWriteStream("./log.txt");
});

server.on('close', () => {
  console.log(`Stopping server running at http://localhost:${port}/`);
  stream.end();
});
