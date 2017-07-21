const {Request, User} = require('../models');

function indexRequestHandler(req, res) {
  const status = req.query.status;

  Request.findAll({
    where: {
      memberId: req.user.id,
      status,
    },
    order: [['createdAt', 'ASC']],
  }).then(requests => {
    const userIds = requests.map(request => request.userId);
    User.findAll({
      where: {id: userIds},
    }).then(users => {
      const requests_ = requests.map(request => {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          if (user.id === request.userId) {
            return {
              id: request.id,
              userId: user.id,
              username: user.username,
              labelId: request.labelId,
              status: request.status,
              createdAt: request.createdAt,
              updatedAt: request.updatedAt,
            };
          }
        }
      });
      res.json(requests_);
    });
  });
}

function createRequestHandler(req, res) {
  const userId = req.user.id;
  const labelId = req.body.labelId;
  const memberNames = req.body.memberNames || [];

  if (memberNames.length) {
    User.findAll({
      where: {
        username: memberNames,
      },
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
  } else {
    res.json([]);
  }
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
    default: {
      Request.update({status}, {
        where: {id: requestId}
      }).then(request => {
        res.json(request);
      });
      res.json();
      break;
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
