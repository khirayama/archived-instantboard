const {Label, Task, Request, LabelStatus, User} = require('../models');

function _getSharedUsers(labelId, requests, users) {
  const sharedUsers = [];
  for (let j = 0; j < requests.length; j++) {
    const request = requests[j];
    if (labelId === request.labelId) {
      for (let k = 0; k < users.length; k++) {
        const user = users[k];
        if (user.id === request.sharedUserId || user.id === request.userId) {
          sharedUsers.push({
            id: user.id,
            username: user.username,
            requestStatus: request.status,
          });
        }
      }
    }
  }
  return sharedUsers;
}

function _indexLabel(userId) {
  return new Promise(resolve => {
    LabelStatus.findAll({
      where: {userId},
      order: [['priority', 'ASC']],
    }).then(labelStatuses => {
      const labelIds = labelStatuses.map(labelStatus => labelStatus.labelId);
      Promise.all([
        Label.findAll({
          where: {id: labelIds},
        }),
        Request.findAll({
          where: {labelId: labelIds},
        }),
      ]).then(values => {
        const labels = values[0];
        const requests = values[1];

        const userIds = requests.map(request => request.sharedUserId).filter(sharedUserId => (sharedUserId !== userId));
        User.findAll({
          where: {id: userIds},
        }).then(users => {
          const labels_ = labelStatuses.map(labelStatus => {
            let newLabel = {};
            for (let i = 0; i < labels.length; i++) {
              const label = labels[i];
              if (label.id === labelStatus.labelId) {
                newLabel = {
                  id: label.id,
                  name: label.name,
                  priority: labelStatus.priority,
                  visibled: labelStatus.visibled,
                  createdAt: label.createdAt,
                  updatedAt: label.updatedAt,
                  sharedUsers: _getSharedUsers(label.id, requests, users),
                };
              }
            }
            return newLabel;
          });
          resolve(labels_);
        });
      });
    });
  });
}

function _createLabel(userId, labelName, userNames = []) {
  return new Promise((resolve, reject) => {
    Promise.all([
      User.findAll({
        where: {username: userNames},
      }),
      Label.create({
        userId,
        name: labelName,
      }),
      LabelStatus.count({
        where: {userId},
      }),
    ]).then(values => {
      const users = values[0];
      const label = values[1];
      const count = values[2];

      if (users.length !== userNames.length) {
        reject(new Error('Include not existed user'));
        return;
      }

      const requests = users.map(user => {
        return {
          userId,
          sharedUserId: user.id,
          labelId: label.id,
          status: 'pending',
        };
      });

      Promise.all([
        LabelStatus.create({
          userId,
          labelId: label.id,
          priority: count,
          visibled: true,
        }),
        Request.bulkCreate(requests),
      ]).then(() => {
        const createdLabel = {
          id: label.id,
          name: label.name,
          priority: count,
          visibled: true,
          createdAt: label.createdAt,
          updatedAt: label.updatedAt,
          sharedUsers: users.map(user => {
            return {
              id: user.id,
              username: user.username,
              requestStatus: 'pending',
            };
          }),
        };
        resolve(createdLabel);
      });
    });
  });
}

function _showLabel(userId, labelId) {
  return new Promise(resolve => {
    Promise.all([
      Label.findById(labelId),
      LabelStatus.findOne({
        where: {userId, labelId},
      }),
    ]).then(values => {
      const label = values[0];
      const labelStatus = values[1];

      Request.findAll({
        where: {labelId: label.id},
      }).then(requests => {
        const userIds = requests.map(request => request.sharedUserId).filter(sharedUserId => (sharedUserId !== userId));

        User.findAll({
          where: {id: userIds},
        }).then(users => {
          const newLabel = {
            id: label.id,
            name: label.name,
            priority: labelStatus.priority,
            visibled: labelStatus.visibled,
            createdAt: labelStatus.createdAt,
            updatedAt: labelStatus.updatedAt,
            sharedUsers: _getSharedUsers(label.id, requests, users),
          };
          resolve(newLabel);
        });
      });
    });
  });
}

function _updateLabel(userId, labelId, newLabel = {}) {
  return new Promise(resolve => {
    Promise.all([
      Label.findById(labelId),
      LabelStatus.findOne({
        where: {userId, labelId},
      }),
    ]).then(values => {
      const label = values[0];
      const labelStatus = values[1];

      Promise.all([
        label.update({name: newLabel.name || label.name}),
        labelStatus.update({
          priority: (newLabel.priority !== undefined && newLabel.priority !== labelStatus.priority) ? newLabel.priority : labelStatus.priority,
          visibled: (newLabel.visibled !== undefined && newLabel.visibled !== labelStatus.visibled) ? newLabel.visibled : labelStatus.visibled,
        }),
      ]).then(() => {
        _showLabel(userId, label.id).then(updatedLabel => {
          resolve(updatedLabel);
        });
      });
    });
  });
}

function _destroyLabel(userId, labelId) {
  return new Promise(resolve => {
    Promise.all([
      _showLabel(userId, labelId),
      Label.findById(labelId),
    ]).then(values => {
      const destroyedLabel = values[0];
      const label = values[1];

      // Remove LabelStatus, Task, Request
      Promise.all([
        new Promise(resolve_ => {
          LabelStatus.findAll({
            where: {labelId: label.id},
          }).then(labelStatuses => {
            let count = 0;

            labelStatuses.forEach(labelStatus => {
              // Decrement
              LabelStatus.findAll({
                where: {
                  userId: labelStatus.userId,
                  priority: {
                    $gt: labelStatus.priority,
                  },
                },
              }).then(labelStatuses => {
                labelStatuses.forEach(labelStatus_ => labelStatus_.increment({priority: -1}));
              });

              labelStatus.destroy().then(() => {
                count += 1;
                if (count === labelStatuses.length) {
                  resolve_();
                }
              });
            });
          });
        }),
        Task.destroy({
          where: {labelId: label.id},
        }),
        Request.destroy({
          where: {labelId: label.id},
        }),
      ]).then(() => {
        label.destroy().then(() => {
          resolve(destroyedLabel);
        });
      });
    });
  });
}

function _sortLabel(userId, labelId, priority) {
  return new Promise(resolve => {
    LabelStatus.findOne({
      where: {userId, labelId},
    }).then(labelStatus => {
      if (labelStatus.priority < priority) {
        LabelStatus.findAll({
          where: {
            userId,
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
            _indexLabel(userId).then(labels => {
              resolve(labels);
            });
          });
        });
      } else if (labelStatus.priority > priority) {
        LabelStatus.findAll({
          where: {
            userId,
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
            _indexLabel(userId).then(labels => {
              resolve(labels);
            });
          });
        });
      }
    });
  });
}

function indexLabelHandler(req, res) {
  _indexLabel(req.user.id).then(labels => {
    res.json(labels);
  });
}

function showLabelHandler(req, res) {
  _showLabel(req.user.id, req.params.id).then(label => {
    res.json(label);
  });
}

function createLabelHandler(req, res) {
  _createLabel(req.user.id, req.body.name, req.body.users).then(label => {
    res.json(label);
  }).catch(err => {
    res.status(400).send(err.message);
  });
}

function updateLabelHandler(req, res) {
  _updateLabel(req.user.id, req.params.id, {
    name: req.body.name,
    priority: req.body.priority,
    visibled: req.body.visibled,
  }).then(label => {
    res.json(label);
  });
}

function destroyLabelHandler(req, res) {
  _destroyLabel(req.user.id, req.params.id).then(() => {
    res.status(204).send();
  });
}

function sortLabelHandler(req, res) {
  _sortLabel(req.user.id, req.params.id, req.body.priority).then(labels => {
    res.json(labels);
  });
}

module.exports = {
  _indexLabel,
  _showLabel,
  _createLabel,
  _updateLabel,
  _destroyLabel,
  _sortLabel,
  indexLabelHandler,
  showLabelHandler,
  createLabelHandler,
  updateLabelHandler,
  destroyLabelHandler,
  sortLabelHandler,
};
