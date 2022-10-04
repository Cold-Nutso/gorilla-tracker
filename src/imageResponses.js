const fs = require('fs'); // Pull in file system module
const jsonHandler = require('./jsonResponses.js'); // Grab jsonHandler

// Load files into memory
const outline = fs.readFileSync(`${__dirname}/../images/outline.png`);
const furs = [
  fs.readFileSync(`${__dirname}/../images/fur_black.png`),
  fs.readFileSync(`${__dirname}/../images/fur_dark-grey.png`),
  fs.readFileSync(`${__dirname}/../images/fur_light-grey.png`),
  fs.readFileSync(`${__dirname}/../images/fur_white.png`),
];
const skins = [
  fs.readFileSync(`${__dirname}/../images/skin_black.png`),
  fs.readFileSync(`${__dirname}/../images/skin_dark-grey.png`),
  fs.readFileSync(`${__dirname}/../images/skin_light-grey.png`),
  fs.readFileSync(`${__dirname}/../images/skin_pink.png`),
];
const faces = [
  fs.readFileSync(`${__dirname}/../images/face_beady.png`),
  fs.readFileSync(`${__dirname}/../images/face_surprised.png`),
  fs.readFileSync(`${__dirname}/../images/face_angry.png`),
  fs.readFileSync(`${__dirname}/../images/face_tired.png`),
  fs.readFileSync(`${__dirname}/../images/face_wild.png`),
  fs.readFileSync(`${__dirname}/../images/face_cool.png`),
];

// Respond with a png (for GET requests)
const respondImage = (request, response, status, image) => {
  // Object for headers
  const headers = {
    'Content-Type': 'image/png',
  };

  // Response with png
  response.writeHead(status, headers);
  response.write(image);
  response.end();
};
// Respond without png (for HEAD requests)
const respondImageMeta = (request, response, status) => {
  // Object for headers
  const headers = {
    'Content-Type': 'image/png',
  };

  // Response without png, just headers
  response.writeHead(status, headers);
  response.end();
};

const respondToIndex = (request, response, array, index) => {
  if (index < 0 || index > array.length) {
    // Respond with a 404
    const responseJSON = {
      message: `No image at index '${index}' was found.`,
      id: 'notFound',
    };
    return jsonHandler.respondJSON(request, response, 404, responseJSON);
  }
  // Otherwise, respond with image
  return respondImage(request, response, 200, array[index]);
};
const respondToIndexMeta = (request, response, array, index) => {
  if (index < 0 || index > array.length) {
    // Respond with a 404
    return jsonHandler.respondJSONMeta(request, response, 404);
  }
  // Otherwise, respond with status
  return respondImageMeta(request, response, 200);
};

const getImage = (request, response, params) => {
  // Default message
  const responseJSON = {
    message: 'Must have a type parameter.',
  };
  // Check for type field
  if (!params.type) {
    responseJSON.id = 'missingParams';
    return jsonHandler.respondJSON(request, response, 400, responseJSON);
  } if (!params.index && params.type !== 'outline') {
    // Only 'outline' type can exclude an index param
    responseJSON.message = `Must have an index parameter for '${params.type}' type.`;
    responseJSON.id = 'missingParams';
    return jsonHandler.respondJSON(request, response, 400, responseJSON);
  }

  // Otherwise, change message and grab appropriate image
  responseJSON.message = 'Success';

  // Need breaks on the switch statement
  let returnThis;
  switch (params.type) {
    case 'outline':
      returnThis = respondImage(request, response, 200, outline);
      break;
    case 'fur':
      returnThis = respondToIndex(request, response, furs, params.index);
      break;
    case 'skin':
      returnThis = respondToIndex(request, response, skins, params.index);
      break;
    case 'face':
      returnThis = respondToIndex(request, response, faces, params.index);
      break;
    default:
      // Respond with a 404
      responseJSON.message = `No image of '${params.type}' was found.`;
      responseJSON.id = 'notFound';
      returnThis = jsonHandler.respondJSON(request, response, 404, responseJSON);
      break;
  }

  return returnThis;
};
const getImageMeta = (request, response, body) => {
  // Check for type field
  if (!body.type) {
    return jsonHandler.respondJSONMeta(request, response, 400);
  } if (!body.index && body.type !== 'outline') {
    // Only 'outline' type can exclude an index param
    return jsonHandler.respondJSONMeta(request, response, 400);
  }

  // Need breaks on the switch statement
  let returnThis;
  switch (body.type) {
    case 'outline':
      returnThis = respondImageMeta(request, response, 200);
      break;
    case 'fur':
      returnThis = respondToIndexMeta(request, response, furs, body.index);
      break;
    case 'skin':
      returnThis = respondToIndexMeta(request, response, skins, body.index);
      break;
    case 'face':
      returnThis = respondToIndexMeta(request, response, faces, body.index);
      break;
    default:
      // Respond with a 404
      returnThis = jsonHandler.respondJSONMeta(request, response, 404);
      break;
  }

  return returnThis;
};

module.exports = {
  getImage,
  getImageMeta,
};
