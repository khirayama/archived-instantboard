const {Label} = require('../models');

function indexLabelHandler(req, res) {
  Label.findAllFromStatus({
    where: {userId: req.user.id},
    order: [['priority', 'ASC']],
  }).then(labels => {
    res.json(labels);
  });
}

function showLabelHandler(req, res) {
  Label.findByIdAndUser(req.params.id, req.user.id).then(label => {
    res.json(label);
  });
}

function createLabelHandler(req, res) {
  Label.createWithStatus({
    userId: req.user.id,
    name: req.body.name,
  }).then(label => {
    res.json(label);
  }).catch(err => {
    res.status(400).send(err.message);
  });
}

function updateLabelHandler(req, res) {
  Label.updateWithStatus(req.params.id, req.user.id, {
    name: req.body.name,
    visibled: req.body.visibled,
  }).then(label => {
    res.json(label);
  });
}

function destroyLabelHandler(req, res) {
  Label.destroyByUser(req.params.id, req.user.id).then(label => {
    res.status(204).json(label);
  });
}

function sortLabelHandler(req, res) {
  Label.sort(req.params.id, req.user.id, req.body.priority).then(labels => {
    res.json(labels);
  });
}

module.exports = {
  indexLabelHandler,
  showLabelHandler,
  createLabelHandler,
  updateLabelHandler,
  destroyLabelHandler,
  sortLabelHandler,
};
