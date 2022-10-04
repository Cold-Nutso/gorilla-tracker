// When node or heroku shuts down this will be cleared
const sightings = {};

// Respond with a json object (for GET requests)
const respondJSON = (request, response, status, object) => {
  // Object for headers
  const headers = {
    'Content-Type': 'application/json',
  };

  // Log the object
  console.log(object);

  // Response with json object
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// Respond without json body (for HEAD requests)
const respondJSONMeta = (request, response, status) => {
  // Object for headers
  const headers = {
    'Content-Type': 'application/json',
  };

  // Response without json object, just headers
  response.writeHead(status, headers);
  response.end();
};

// Get user object
const getApes = (request, response) => {
  // JSON object
  const responseJSON = {
    sightings,
  };

  // Return status code and message
  return respondJSON(request, response, 200, responseJSON);
};

// Get meta info of user object
const getApesMeta = (request, response) => {
  // Return status code and meta data
  respondJSONMeta(request, response, 200);
};

// Not found (for GET requests)
const notFound = (request, response) => {
  // Error message and id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // Return status code and message
  respondJSON(request, response, 404, responseJSON);
};

// Not found (for HEAD requests)
const notFoundMeta = (request, response) => {
  // Return status code without message
  respondJSONMeta(request, response, 404);
};

// Add a user from a POST body
const addApe = (request, response, body) => {
  // Default message
  const responseJSON = {
    message: 'Must have a name parameter.',
  };

  // Check for both fields
  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Default status code to 204
  let responseCode = 204;

  // If name doesn't exist yet
  if (!sightings[body.name]) {
    responseCode = 201;
    sightings[body.name] = {};
  }

  // Add/update fields for user name
  sightings[body.name].looks = body.looks;
  sightings[body.name].name = body.name;
  sightings[body.name].bio = body.bio;

  // If response is created, set message and send response
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // Else, send meta data with 204
  return respondJSONMeta(request, response, responseCode);
};

module.exports = {
  respondJSON,
  respondJSONMeta,
  getApes,
  getApesMeta,
  notFound,
  notFoundMeta,
  addApe,
};
