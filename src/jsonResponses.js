// When node or heroku shuts down this will be cleared
const users = {};

// Respond with a json object (for GET requests)
const respondJSON = (request, response, status, object) => {
  // Object for headers
  const headers = {
    'Content-Type': 'application/json',
  };

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
const getUsers = (request, response) => {
  // JSON object
  const responseJSON = {
    users,
  };

  // Return status code and message
  return respondJSON(request, response, 200, responseJSON);
};

// Get meta info of user object
const getUsersMeta = (request, response) => {
  // Return status code and meta data
  return respondJSONMeta(request, response, 200);
};

// Update user object
const updateUser = (request, response) => {
  // Change to make to user
  // This is just a dummy object for example
  const newUser = {
    createdAt: Date.now(),
  };

  // Modifying our dummy object
  // Just indexing by time for now
  users[newUser.createdAt] = newUser;

  // Return status code and object
  return respondJSON(request, response, 201, newUser);
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

module.exports = {
  getUsers,
  getUsersMeta,
  updateUser,
  notFound,
  notFoundMeta,
};
