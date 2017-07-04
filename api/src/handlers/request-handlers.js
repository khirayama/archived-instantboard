const {Request, User} = require('../models');

function indexRequestHandler(req, res) {
  Request.findAll({
    where: {userId: req.user.id},
    order: [['createdAt', 'ASC']],
  }).then(requests => {
    res.json(requests);
  });
}

function createRequestHandler(req, res) {
  const userId = req.user.id;
  const labelId = req.body.labelId;
  const memberNames = req.body.memberNames || [];

  User.findAll({
    username: memberNames,
  }).then(users => {
    const requests = users.map(user => {
      return {
        userId,
        labelId,
        memberId: user.id,
      };
    });
    Request.bulkCreate(requests).then(requests => {
      res.json(requests);
    });
  });
}

function updateRequestHandler(req, res) {
  const requestId = req.params.id;
  const status = req.body.status;

  switch (status) {
    case 'accepted': {
      Request.accept({
        where: {id: requestId},
      }).then(request => {
        res.json(request);
      });
      break;
    }
    case 'refused': {
      Request.destroy({
        where: {id: requestId},
      }).then(request => {
        res.json(request);
      });
      break;
    }
    default: {
      res.json();
    }
  }
}

function destroyRequestHandler(req, res) {
  const requestId = req.params.id;

  Request.destroy({
    where: {id: requestId},
  }).then(request => {
    res.json(request);
  });
}

module.exports = {
  indexRequestHandler,
  createRequestHandler,
  updateRequestHandler,
  destroyRequestHandler,
};
