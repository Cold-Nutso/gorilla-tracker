const fs = require('fs'); // Pull in file system module

// Load files into memory
const outlineSrc = fs.readFileSync(`${__dirname}/../images/outline.png`);

const getImage = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.write(outlineSrc);
    response.end();
};

module.exports = {
    getImage,
};
