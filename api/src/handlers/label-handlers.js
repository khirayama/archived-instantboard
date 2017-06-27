const {Label, Task, Request} = require('../models');

function indexLabelHandler(req, res) {
  if (req.query.shared) {
    Request.findAll({
      where: {
        sharedUserId: req.user.id,
        status: 'accepted',
      },
    }).then(requests => {
      const labelIds = requests.map(request => request.labelId);
      Label.findAll({
        where: {labelId: labelIds},
        order: [['priority', 'ASC']],
      }).then(labels => {
        res.json(labels);
      });
    });
  } else {
    Label.findAll({
      where: {userId: req.user.id},
      order: [['priority', 'ASC']],
    }).then(labels => {
      res.json(labels);
    });
  }
}

function createLabelHandler(req, res) {
  Label.count({
    where: {
      userId: req.user.id,
    },
  }).then(count => {
    Label.create({
      userId: req.user.id,
      name: req.body.name,
      priority: count,
      visibled: true,
    }).then(label => {
      res.json(label);
    });
  });
}

function updateLabelHandler(req, res) {
  Label.findById(req.params.id).then(label => {
    label.update({
      name: (req.body.name === undefined) ? label.name : req.body.name,
      priority: (req.body.priority === undefined) ? label.priority : req.body.priority,
      visibled: (req.body.visibled === undefined) ? label.visibled : req.body.visibled,
    }).then(() => {
      res.json(label);
    });
  });
}

function destroyLabelHandler(req, res) {
  Label.findById(req.params.id).then(label => {
    Label.findAll({
      where: {
        userId: req.user.id,
        priority: {
          $gt: label.priority,
        },
      },
    }).then(labels => {
      labels.forEach(label_ => {
        label_.update({priority: label_.priority - 1});
      });
    });

    Task.findAll({
      where: {
        labelId: label.id,
      },
    }).then(tasks => {
      tasks.forEach(task => {
        task.destroy();
      });
    });

    label.destroy().then(destroyedLabel => {
      res.json(destroyedLabel);
    });
  });
}

function updateLabelsHandler(req, res) {
  const labels = req.body;

  labels.forEach(newLabel => {
    Label.findById(newLabel.id).then(label => {
      label.update({
        name: (newLabel.name === undefined) ? label.name : newLabel.name,
        priority: (newLabel.priority === undefined) ? label.priority : newLabel.priority,
        visibled: (newLabel.visibled === undefined) ? label.visibled : newLabel.visibled,
      });
    });
  });
  res.json();
}

module.exports = {
  indexLabelHandler,
  createLabelHandler,
  updateLabelHandler,
  destroyLabelHandler,
  updateLabelsHandler,
};
