const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');

const {User} = require('./models');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';
const SECRET_KEY = 'asdfghjkl';
const loginStatuses = {
  NOT_AUTHORIZED: 'not_authorized',
  CONNECTED: 'connected',
};

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

// Handlers
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

function loginStatusHandler(req, res) {
  const notAuthorizedStatus = {
    status: loginStatuses.NOT_AUTHORIZED,
    user: null,
  };

  const accessToken = extractAccessTokenFromHeader(req.headers.authorization);
  if (!accessToken) {
    res.json(notAuthorizedStatus);
    return;
  }

  const payload = checkAccessToken(accessToken);
  if (payload === null) {
    res.json(notAuthorizedStatus);
    return;
  }

  User.findById(payload.sub).then(user => {
    res.json({
      status: loginStatuses.CONNECTED,
      user,
    });
  }).catch(() => {
    res.status(401).send({
      error: 'Invalid access token.',
    });
  });
}

function createTokenHandler(req, res) {
  const provider = req.body.provider;
  const uid = req.body.uid;

  User.findOrCreate({
    where: {provider, uid},
    defaults: {provider, uid},
  }).spread(user => {
    const now = new Date();
    const expires = now.setYear(now.getFullYear() + 1);

    // Ref: [JA] https://hiyosi.tumblr.com/post/70073770678/jwt%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E7%B0%A1%E5%8D%98%E3%81%AB%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E3%81%BF%E3%81%9F
    const accessToken = jwt.encode({
      sub: user.id,
      exp: expires,
      iat: now.getTime(),
    }, SECRET_KEY);
    res.json({accessToken});
  });
}

function fetchCurrentUser(req, res) {
  const user = req.user || null;

  if (user === null) {
    res.status(401).send({
      error: 'Need to set access token to header.Authorization as Bearer.',
    });
  }
  res.json(req.user);
}

function updateCurrentUser(req, res) {
  const user = req.user || null;
  const username = req.body.username;

  User.findById(user.id).then(user => {
    user.update({username}).then(() => {
      res.status(200).send();
    }).catch(err => {
      if (err.errors[0].message === 'username must be unique') {
        res.status(400).send({error: 'Already existed.'});
      }
    });
  }).catch(() => {
    res.status(400).send({error: 'Invalid access token.'});
  });
}

// Router
const router = new express.Router('');

router.use('/api', new express.Router()
  .use('/v1', new express.Router()
    .get('/login-status', loginStatusHandler)
    .post('/tokens', createTokenHandler)
    .use('/users', new express.Router()
      .get('/current', [requireAuthorization], fetchCurrentUser)
      .put('/current', [requireAuthorization], updateCurrentUser)
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
