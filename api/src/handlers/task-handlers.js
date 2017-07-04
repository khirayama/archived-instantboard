const {Task} = require('../models');

function indexTaskHandler(req, res) {
  const userId = req.user.id;

  Task.findAll({
    where: {userId},
    order: [['labelId', 'ASC'], ['priority', 'ASC']],
  }).then(tasks => {
    res.json(tasks);
  });
}

function createTaskHandler(req, res) {
  const userId = req.user.id;
  const labelId = req.body.labelId;
  const content = req.body.content;

  Task.count({
    where: {userId, labelId},
  }).then(count => {
    Task.create({
      userId,
      labelId,
      content,
      priority: count,
      completed: false,
    }).then(task => {
      res.json(task);
    });
  });
}

function showTaskHandler() {
  const taskId = req.params.id;

  Task.findById(taskId).then(task => {
    res.json(task);
  });
}

function updateTaskHandler(req, res) {
  const taskId = req.params.id;

  Task.findById(taskId).then(task => {
    // TODO: Change labelId
    task.update({
      labelId: req.body.labelId,
      content: req.body.content,
      completed: req.body.completed,
    }).then(() => {
      res.json(task);
    });
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
          }).then(taks_ => {
            res.json(task_);
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
          Task.findAllFromStatus({
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
