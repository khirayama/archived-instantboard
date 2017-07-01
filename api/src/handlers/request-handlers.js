const {Request} = require('../models');

function indexRequestHandler(req, res) {
  Request.findAll({
    where: {userId: req.user.id},
    order: [['createdAt', 'ASC']],
  }).then(requests => {
    res.json(requests);
  });
}

function createRequestHandler(req, res) {
  Request.create({
    userId: req.user.id,
    memberId: req.body.memberId,
    labelId: req.body.labelId,
  }).then(request => {
    res.json(request);
  });
}

function updateRequestHandler(req, res) {
  Request.findById(req.params.id).then(request => {
    if (request.body.status !== req.body.status) {
      request.update({
        status: req.body.status,
      }).then(() => {
        res.json(request);
      });
    }
    res.json(request);
  });
}

function destroyRequestHandler(req, res) {
  Request.findById(req.params.id).then(request => {
    request.destroy().then(destroyedRequest => {
      res.json(destroyedRequest);
    });
  });
}

module.exports = {
  indexRequestHandler,
  createRequestHandler,
  updateRequestHandler,
  destroyRequestHandler,
};
