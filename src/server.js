const http = require('http'); // HTTP module
const url = require('url'); // URL module
const query = require('querystring'); // Custom files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const imageHandler = require('./imageResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Route request to proper handler
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getApes': jsonHandler.getApes,
    '/getJS': htmlHandler.getJS,
    '/getImage': imageHandler.getImage,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getApes': jsonHandler.getApesMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addApe': jsonHandler.addApe,
  },
};

// Recompile body of request and call handler
const parseBody = (request, response, handler) => {
  // Body array for storing pieces
  const body = [];

  // Event handlers for responses

  // Bad request error
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // Add data chunk to array
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // Finished request
  request.on('end', () => {
    // Turn array into a single entity
    const bodyString = Buffer.concat(body).toString();
    // Parse into string
    const bodyParams = query.parse(bodyString);

    // Call handler
    handler(request, response, bodyParams);
  });
};

// Handle requests
const onRequest = (request, response) => {
  // Parse info from URL
  const parsedUrl = url.parse(request.url);

  // Check if no method
  if (!urlStruct[request.method]) {
    return urlStruct.HEAD.notFound(request, response);
  } if (request.method === 'POST') {
    return parseBody(request, response, urlStruct[request.method][parsedUrl.pathname]);
  } if (urlStruct[request.method][parsedUrl.pathname]) {
    return urlStruct[request.method][parsedUrl.pathname](request, response);
  }
  return urlStruct[request.method].notFound(request, response);
};

// Start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
