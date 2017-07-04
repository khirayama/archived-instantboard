const {Label, Task} = require('../models');

function indexTaskHandler(req, res) {
  const userId = req.user.id;

  Label.findAllFromStatus({
    where: {userId},
  }).then(labels => {
    const labelIds = labels.map(label => label.id);
    Task.findAll({
      where: {labelId: labelIds},
      order: [['priority', 'ASC']],
    }).then(tasks => {
      res.json(tasks);
    });
  });
}

function createTaskHandler(req, res) {
  const userId = req.user.id;
  const labelId = req.body.labelId;
  const content = req.body.content;

  Task.createWithPriority({
    userId,
    labelId,
    content,
  }).then(task => {
    res.json(task);
  });
}

function showTaskHandler(req, res) {
  const taskId = req.params.id;

  Task.findById(taskId).then(task => {
    res.json(task);
  });
}

function updateTaskHandler(req, res) {
  const userId = req.user.id;
  const taskId = req.params.id;
  const labelId = req.body.labelId;
  const content = req.body.content;
  const completed = req.body.completed;

  Task.findById(taskId).then(task => {
    if (labelId && labelId !== task.labelId) {
      Promise.all([
        Task.count({
          where: {userId, labelId},
        }),
        Task.findAll({
          where: {
            userId,
            labelId: task.labelId,
            priority: {
              $gt: task.priority,
            },
          },
        }),
      ]).then(values => {
        const count = values[0];
        const tasks = values[1];

        tasks.forEach(task_ => {
          task_.update({priority: task_.priority - 1});
        });

        task.update({
          content,
          completed,
          priority: count,
        }).then(() => {
          res.json(task);
        });
      });
    } else {
      task.update({
        content: (content === undefined) ? task.content : content,
        completed: (completed === undefined) ? task.completed : completed,
      }).then(() => {
        res.json(task);
      });
    }
  });
}

function destroyTaskHandler(req, res) {
  const userId = req.user.id;
  const taskId = req.params.id;

  Task.findById(taskId).then(task => {
    Task.findAll({
      where: {
        userId,
        labelId: task.labelId,
        priority: {
          $gt: task.priority,
        },
      },
    }).then(tasks => {
      tasks.forEach(task_ => {
        task_.update({priority: task_.priority - 1});
      });
    });

    task.destroy().then(destroyedTask => {
      res.json(destroyedTask);
    });
  });
}

function sortTaskHandler(req, res) {
  const userId = req.user.id;
  const taskId = req.params.id;
  const priority = req.body.priority;

  Task.findById(taskId).then(task => {
    if (task.priority < priority) {
      Task.findAll({
        where: {
          userId,
          priority: {
            $gt: task.priority,
            $lte: priority,
          },
        },
      }).then(tasks => {
        tasks.forEach(task_ => {
          task_.update({priority: task_.priority - 1});
        });
        task.update({priority}).then(() => {
          Task.findAll({
            where: {userId},
            order: [['priority', 'ASC']],
          }).then(tasks_ => {
            res.json(tasks_);
          });
        });
      });
    } else if (task.priority > priority) {
      Task.findAll({
        where: {
          userId,
          priority: {
            $gte: priority,
            $lt: task.priority,
          },
        },
      }).then(tasks => {
        tasks.forEach(task_ => {
          task_.update({priority: task_.priority + 1});
        });
        task.update({priority}).then(() => {
          Task.findAll({
            where: {userId},
            order: [['priority', 'ASC']],
          }).then(tasks_ => {
            res.json(tasks_);
          });
        });
      });
    }
  });
}

module.exports = {
  indexTaskHandler,
  createTaskHandler,
  showTaskHandler,
  updateTaskHandler,
  destroyTaskHandler,
  sortTaskHandler,
};
