const {errorMessages} = require('../constants');
const {User} = require('../models');

function _transformUser(user) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function showCurrentUserHandler(req, res) {
  const user = req.user || null;

  if (user === null) {
    res.status(401).json({
      message: errorMessages.NO_ACCESS_TOKEN,
    });
    return;
  }
  res.json(_transformUser(req.user));
}

function updateCurrentUserHandler(req, res) {
  const user = req.user || null;
  const username = req.body.username;

  User.update({username}, {
    where: {id: user.id},
    individualHooks: true,
  }).spread((count, users) => {
    const user_ = users[0].dataValues;
    res.json(_transformUser(user_));
  }).catch(err => {
    let code = 500;
    let message = errorMessages.UNKNOWN_ERROR;

    if (err.errors && err.errors[0].message === 'username must be unique') {
      code = 400;
      message = errorMessages.ALREADY_EXISTED_USER;
    }
    res.status(code).json({message});
  });
}

module.exports = {
  showCurrentUserHandler,
  updateCurrentUserHandler,
};
