const {Label, Task, Request, LabelStatus, User} = require('../models');

function fetchLabels(userId) {
  return new Promise(resolve => {
    LabelStatus.findAll({
      where: {userId},
      order: [['priority', 'ASC']],
    }).then(labelStatuses => {
      const labelIds = labelStatuses.map(labelStatus => labelStatus.labelId);
      Label.findAll({
        where: {id: labelIds},
      }).then(labels => {
        const labelIds = labels.map(label => label.id);
        Request.findAll({
          where: {
            labelId: labelIds,
            status: 'accepted',
          },
        }).then(requests => {
          const userIds = requests.map(request => request.sharedUserId);
          User.findAll({
            where: {
              id: userIds,
            },
          }).then(users => {
            const labels_ = labelStatuses.map(labelStatus => {
              for (let i = 0; i < labels.length; i++) {
                const label = labels[i];
                if (label.id === labelStatus.labelId) {
                  const newLabel = {
                    id: label.id,
                    name: label.name,
                    priority: labelStatus.priority,
                    visibled: labelStatus.visibled,
                    createdAt: label.createdAt,
                    updatedAt: label.updatedAt,
                    sharedUsers: [],
                  };
                  for (let j = 0; j < requests.length; j++) {
                    const request = requests[j];
                    if (label.id === request.labelId) {
                      for (let k = 0; k < users.length; k++) {
                        const user = users[k];
                        if (user.id === request.sharedUserId) {
                          newLabel.sharedUsers.push({
                            id: user.id,
                            username: user.username,
                          });
                        }
                      }
                    }
                  }
                  return newLabel;
                }
              }
            });
            resolve(labels_);
          });
        });
      });
    });
  });
}

function indexLabelHandler(req, res) {
  fetchLabels(req.user.id).then(labels => {
    res.json(labels);
  });
}

function createLabelHandler(req, res) {
  const users = req.body.users || [];

  User.findAll({
    where: {
      username: users,
    },
  }).then(users_ => {
    if (users_.length === users.length) {
      Label.create({
        userId: req.user.id,
        name: req.body.name,
      }).then(label => {
        LabelStatus.count({
          where: {
            userId: req.user.id,
          },
        }).then(count => {
          LabelStatus.create({
            userId: req.user.id,
            labelId: label.id,
            priority: count,
            visibled: true,
          });
          const sharedUsers = users_.map(user => {
            Request.create({
              userId: req.user.id,
              sharedUserId: user.id,
              labelId: label.id,
              status: 'pending',
            });

            return {
              id: user.id,
              username: user.username,
              requestStatus: 'pending',
            };
          });
          res.json({
            id: label.id,
            name: label.name,
            priority: count,
            visibled: true,
            createdAt: label.createdAt,
            updatedAt: label.updatedAt,
            sharedUsers: sharedUsers,
          });
        });
      });
    } else {
      res.status(400);
    }
  });
}

function updateLabelHandler(req, res) {
  Label.findById(req.params.id).then(label => {
    label.update({name: req.body.name || label.name}).then(() => {
      LabelStatus.findOne({
        where: {
          userId: req.user.id,
          labelId: label.id,
        },
      }).then(labelStatus => {
        console.log(req.body);
        labelStatus.update({
          priority: (req.body.priority !== undefined && req.body.priority !== labelStatus.priority) ? req.body.priority : labelStatus.priority,
          visibled: (req.body.visibled !== undefined && req.body.visibled !== labelStatus.visibled) ? req.body.visibled : labelStatus.visibled,
        }).then(labelStatus_ => {
          Request.findAll({
            where: {
              labelId: label.id,
              status: 'accepted',
            },
          }).then(requests => {
            const userIds = requests.map(request => request.sharedUserId);
            User.findAll({
              where: {
                id: userIds,
              },
            }).then(users => {
              const newLabel = {
                id: label.id,
                name: label.name,
                priority: labelStatus_.priority,
                visibled: labelStatus_.visibled,
                createdAt: label.createdAt,
                updatedAt: label.updatedAt,
                sharedUsers: [],
              };
              for (let j = 0; j < requests.length; j++) {
                const request = requests[j];
                if (label.id === request.labelId) {
                  for (let k = 0; k < users.length; k++) {
                    const user = users[k];
                    if (user.id === request.sharedUserId) {
                      newLabel.sharedUsers.push({
                        id: user.id,
                        username: user.username,
                        requestStatus: request.status,
                      });
                    }
                  }
                }
              }
              res.json(newLabel);
            });
          });
        });
      });
    });
  });
}

function destroyLabelHandler(req, res) {
  Label.findById(req.params.id).then(label => {
    LabelStatus.findAll({
      where: {
        labelId: label.id,
      }
    }).then(labelStatuses => {
      labelStatuses.forEach(labelStatus => {
        LabelStatus.findAll({
          where: {
            userId: labelStatus.userId,
            priority: {
              $gt: labelStatus.priority,
            },
          },
        }).then(labelStatuses => {
          labelStatuses.forEach(labelStatus_ => {
            labelStatus_.update({priority: labelStatus_.priority - 1});
          });
        });
        labelStatus.destroy();
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

    Request.findAll({
      where: {
        labelId: label.id,
      },
    }).then(requests => {
      requests.forEach(request => {
        request.destroy();
      });
    });

    label.destroy().then(destroyedLabel => {
      res.json(destroyedLabel.id);
    });
  });
}

function sortLabelHandler(req, res) {
  LabelStatus.findOne({
    where: {
      labelId: req.params.id,
      userId: req.user.id,
    },
  }).then(labelStatus => {
    const priority = req.body.priority;

    if (labelStatus.priority < priority) {
      LabelStatus.findAll({
        where: {
          userId: req.user.id,
          priority: {
            $gt: labelStatus.priority,
            $lte: priority,
          },
        },
      }).then(labelStatuses => {
        labelStatuses.forEach(labelStatus_ => {
          labelStatus_.update({priority: labelStatus_.priority - 1});
        });
        labelStatus.update({priority}).then(() => {
          fetchLabels(req.user.id).then(labels => {
            res.json(labels);
          });
        });
      });
    } else if (labelStatus.priority > priority) {
      LabelStatus.findAll({
        where: {
          userId: req.user.id,
          priority: {
            $gte: priority,
            $lt: labelStatus.priority,
          },
        },
      }).then(labelStatuses => {
        labelStatuses.forEach(labelStatus_ => {
          labelStatus_.update({priority: labelStatus_.priority + 1});
        });
        labelStatus.update({priority}).then(() => {
          fetchLabels(req.user.id).then(labels => {
            res.json(labels);
          });
        });
      });
    }
  });
}

module.exports = {
  indexLabelHandler,
  createLabelHandler,
  updateLabelHandler,
  destroyLabelHandler,
  sortLabelHandler,
};
