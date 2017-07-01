const {User} = require('../models');

function _updateCurrentUser(userId, username) {
  return new Promise((resolve, reject) => {
    User.findById(userId).then(user => {
      user.update({username}).then(() => {
        resolve();
      }).catch(err => {
        if (err.errors[0].message === 'username must be unique') {
          reject(new Error('Already existed'));
        }
      });
    }).catch(() => {
      reject(new Error('Invalid access token'));
    });
  });
}

function fetchCurrentUserHandler(req, res) {
  const user = req.user || null;

  if (user === null) {
    res.status(401).send('Need to set access token to header.Authorization as Bearer');
  }
  res.json(req.user);
}

function updateCurrentUserHandler(req, res) {
  const user = req.user || null;
  const username = req.body.username;

  _updateCurrentUser(user.id, username).then(() => {
    res.status(200).send();
  }).catch(err => {
    res.status(400).send(err.message);
  });
}

module.exports = {
  fetchCurrentUserHandler,
  updateCurrentUserHandler,
};
