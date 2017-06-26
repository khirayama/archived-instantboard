const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');

const {SECRET_KEY} = require('./constants');

const {User} = require('./models');

const {
  fetchCurrentUserHandler,
  updateCurrentUserHandler,
} = require('./handlers/user-handlers');

const {
  createTokenHandler,
} = require('./handlers/token-handlers');

const {
  indexTaskHandler,
  updateTasksHandler,
  createTaskHandler,
  updateTaskHandler,
  destroyTaskHandler,
} = require('./handlers/task-handlers');

const {
  indexLabelHandler,
  updateLabelsHandler,
  createLabelHandler,
  updateLabelHandler,
  destroyLabelHandler,
} = require('./handlers/label-handlers');

const {
  indexRequestHandler,
  createRequestHandler,
  updateRequestHandler,
  destroyRequestHandler,
} = require('./handlers/request-handlers');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

function extractAccessTokenFromHeader(authorizationString = '') {
  return authorizationString.replace(/^Bearer/, '').trim();
}

function checkAccessToken(accessToken) {
  try {
    if (!accessToken) {
      return null;
    }
    const payload = jwt.decode(accessToken, SECRET_KEY);
    const now = new Date().getTime();

    if (!payload || payload.exp < now) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

function requireAuthorization(req, res, next) {
  const accessToken = extractAccessTokenFromHeader(req.headers.authorization);
  const payload = checkAccessToken(accessToken);

  if (payload === null) {
    res.status(401).send({
      error: 'Need to set access token to header.Authorization as Bearer.',
    });
    return;
  }

  User.findById(payload.sub).then(user => {
    req.user = user;
    req.isAuthenticated = true;
    next();
  }).catch(() => {
    res.status(401).send({
      error: 'Invalid access token.',
    });
  });
}

const router = new express.Router('');

router.use('/api', new express.Router()
  .use('/v1', new express.Router()
    .use('/tokens', new express.Router()
      .post('/', createTokenHandler)
    )
    .use('/users', new express.Router()
      .get('/current', [requireAuthorization], fetchCurrentUserHandler)
      .put('/current', [requireAuthorization], updateCurrentUserHandler)
    )
    .use('/tasks', new express.Router()
      .get('/', [requireAuthorization], indexTaskHandler)
      .put('/', [requireAuthorization], updateTasksHandler)
      .post('/', [requireAuthorization], createTaskHandler)
      .put('/:id', [requireAuthorization], updateTaskHandler)
      .delete('/:id', [requireAuthorization], destroyTaskHandler)
    )
    .use('/labels', new express.Router()
      .get('/', [requireAuthorization], indexLabelHandler)
      .put('/', [requireAuthorization], updateLabelsHandler)
      .post('/', [requireAuthorization], createLabelHandler)
      .put('/:id', [requireAuthorization], updateLabelHandler)
      .delete('/:id', [requireAuthorization], destroyLabelHandler)
    )
    .use('/request', new express.Router()
      .get('/', [requireAuthorization], indexRequestHandler)
      .post('/', [requireAuthorization], createRequestHandler)
      .put('/:id', [requireAuthorization], updateRequestHandler)
      .delete('/:id', [requireAuthorization], destroyRequestHandler)
    )
  )
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});
app.use(router);

// Main
console.log('Example app listening on port 3000!');
server.listen(port, host);
