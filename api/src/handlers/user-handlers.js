const {errorMessages} = require('../constants');
const {User} = require('../models');

function showCurrentUserHandler(req, res) {
  const user = req.user || null;

  if (user === null) {
    res.status(401).json({
      message: errorMessages.NO_ACCESS_TOKEN,
    });
    return;
  }
  res.json(req.user);
}

function updateCurrentUserHandler(req, res) {
  const user = req.user || null;
  const username = req.body.username;

  User.update({username}, {
    where: {id: user.id},
    individualHooks: true,
  }).spread((count, users) => {
    const user_ = users[0].dataValues;
    res.status(200).json(user_);
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
