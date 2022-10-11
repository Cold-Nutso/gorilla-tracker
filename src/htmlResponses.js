const fs = require('fs'); // Pull in file system module

// Load files into memory
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const clientJS = fs.readFileSync(`${__dirname}/../client/wasClient.js`);
const apeJS = fs.readFileSync(`${__dirname}/../client/apeFunctions.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getClientJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(clientJS);
  response.end();
};
const getApeJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(apeJS);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getClientJS,
  getApeJS,
};
