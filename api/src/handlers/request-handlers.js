const {Request, User} = require('../models');

function _transformRequest(request) {
  return {
    id: request.id,
    memberId: request.userId, // ATENTION: request.userId -> memberId
    labelId: request.labelId,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}

function indexRequestHandler(req, res) {
  const status = req.query.status;

  Request.findAll({
    where: {
      memberId: req.user.id,
      status,
    },
    order: [['createdAt', 'ASC']],
  }).then(requests => {
    res.json(requests.map(_transformRequest));
  });
}

function createRequestHandler(req, res) {
  const userId = req.user.id;
  const labelId = req.body.labelId;
  const memberId = req.body.memberId || null;
  const memberName = req.body.memberName || null;

  if (memberId) {
    Request.findOrCreate({
      where: {
        userId,
        labelId,
        memberId,
        status: ['pending', 'accepted'],
      },
      defaults: {
        userId,
        labelId,
        memberId,
      },
    }).then(request => {
      res.json(_transformRequest(request[0]));
    });
  } else if (memberName) {
    User.findOne({
      where: {
        username: memberName,
      },
    }).then(user => {
      Request.findOrCreate({
        where: {
          userId,
          labelId,
          memberId: user.id,
          status: ['pending', 'accepted'],
        },
        defaults: {
          userId,
          labelId,
          memberId: user.id,
          status: 'pending',
        },
      }).then(request => {
        res.json(_transformRequest(request[0]));
      });
    });
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
        res.json(_transformRequest(request));
      });
      break;
    }
    default: {
      Request.update({status}, {
        where: {id: requestId},
      }).then(request => {
        res.json(_transformRequest(request));
      });
      break;
    }
  }
}

function destroyRequestHandler(req, res) {
  const requestId = req.params.id;

  Request.destroy({
    where: {id: requestId},
  }).then(request => {
    res.json(_transformRequest(request));
  });
}

module.exports = {
  indexRequestHandler,
  createRequestHandler,
  updateRequestHandler,
  destroyRequestHandler,
};
