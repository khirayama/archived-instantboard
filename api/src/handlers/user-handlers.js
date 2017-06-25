const {User} = require('../models');

function fetchCurrentUserHandler(req, res) {
  const user = req.user || null;

  if (user === null) {
    res.status(401).send({
      error: 'Need to set access token to header.Authorization as Bearer.',
    });
  }
  res.json(req.user);
}

function updateCurrentUserHandler(req, res) {
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

module.exports = {
  fetchCurrentUserHandler,
  updateCurrentUserHandler,
};
