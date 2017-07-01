const test = require('ava');
const uuid = require('uuid/v4');
const Ajv = require('ajv');
const jwt = require('jwt-simple');

const {SECRET_KEY} = require('../../src/constants');
const models = require('../../src/models');
const {_createToken} = require('../../src/handlers/token-handlers');
const {
  _showLabel,
  _indexLabel,
  _createLabel,
  _updateLabel,
  _destroyLabel,
  _sortLabel,
} = require('../../src/handlers/label-handlers');

const labelResponseSchema = require('../schemes/label-response-scheme');

const ajv = new Ajv();

test.cb.beforeEach(t => {
  const uuids = [uuid(), uuid(), uuid()];
  Promise.all(
    uuids.map(_uuid => _createToken('facebook', _uuid, `test user ${_uuid}`)),
  ).then(values => {
    t.context.users = values.map((value, index) => {
      const token = value.accessToken;
      const info = jwt.decode(token, SECRET_KEY);
      return {
        id: info.sub,
        username: `test user ${uuids[index]}`,
      };
    });
    t.end();
  });
});

test.cb('_indexLabel > fetch labels', t => {
  const user = t.context.users[0];
  const user2 = t.context.users[1];

  // FIXME: If use promise all, `count is same`. I need to fix it. Cause is label-handlers/createLabelHandler
  new Promise(resolve => {
    _createLabel(user.id, `Test label ${user.id}`, [user2.username]).then(() => {
      _createLabel(user.id, `Test label ${user.id}`).then(resolve);
    });
  }).then(() => {
    _indexLabel(user.id).then(labels => {
      t.true(ajv.validate({
        type: 'array',
        items: labelResponseSchema,
      }, labels));
      t.is(labels.length, 2);
      t.is(labels[0].priority, 0);
      t.is(labels[1].priority, 1);
      t.end();
    });
  });
});

test.cb('fetchCurrentUserHandler', t => {
  const user = t.context.users[0];
  const user2 = t.context.users[1];

  // FIXME: If use promise all, `count is same`. I need to fix it. Cause is label-handlers/createLabelHandler
  new Promise(resolve => {
    _createLabel(user.id, `Test label ${user.id}`, [user2.username]).then(() => {
      _createLabel(user.id, `Test label ${user.id}`).then(() => {
        _createLabel(user2.id, `Test label ${user2.id}`).then(() => {
          _createLabel(user2.id, `Test label ${user2.id}`, [user.username]).then(resolve);
        });
      });
    });
  }).then(() => {
    models.Request.findOne({
      where: {sharedUserId: user.id, status: 'pending'},
    }).then(request => {
      request.accept().then(() => {
        _indexLabel(user.id).then(labels => {
          t.true(ajv.validate({
            type: 'array',
            items: labelResponseSchema,
          }, labels));
          t.is(labels[0].priority, 0);
          t.is(labels[0].sharedUsers[0].username, user2.username);
          t.is(labels[0].sharedUsers[0].requestStatus, 'pending');
          t.is(labels[1].priority, 1);
          t.is(labels[2].priority, 2);
          t.is(labels[2].sharedUsers[0].username, user2.username);
          t.is(labels[2].sharedUsers[0].requestStatus, 'accepted');
          t.is(labels.length, 3);
          t.end();
        });
      });
    });
  });
});

test.cb('createLabelHandler > Create label without shared users', t => {
  const user = t.context.users[0];

  _createLabel(user.id, `Test label ${user.id}`).then(label => {
    t.true(ajv.validate(labelResponseSchema, label));
    t.is(label.name, `Test label ${user.id}`);
    t.is(label.priority, 0);
    t.is(label.sharedUsers.length, 0);
    t.true(label.visibled);
    t.end();
  });
});

test.cb('createLabelHandler > Create label with shared users', t => {
  const user = t.context.users[0];
  const user2 = t.context.users[1];

  _createLabel(user.id, `Test label ${user.id}`, [user2.username]).then(label => {
    t.true(ajv.validate(labelResponseSchema, label));
    t.is(label.name, `Test label ${user.id}`);
    t.is(label.priority, 0);
    t.is(label.sharedUsers.length, 1);
    t.true(label.visibled);
    t.end();
  });
});

test.cb('createLabelHandler > Create label with shared 2 users', t => {
  const user = t.context.users[0];
  const user2 = t.context.users[1];
  const user3 = t.context.users[2];

  _createLabel(user.id, `Test label ${user.id}`, [user2.username, user3.username]).then(label => {
    t.true(ajv.validate(labelResponseSchema, label));
    t.is(label.name, `Test label ${user.id}`);
    t.is(label.priority, 0);
    t.true(label.visibled);
    t.is(label.sharedUsers.length, 2);
    t.end();
  });
});

test.cb('createLabelHandler > Create label with share not existed user', t => {
  const user = t.context.users[0];

  _createLabel(user.id, `Test label ${user.id}`, ['not existed user']).catch(err => {
    t.is(err.message, 'Include not existed user');
    t.end();
  });
});

test.cb('updateLabelHandler > update name', t => {
  const user = t.context.users[0];

  _createLabel(user.id, `Test label ${user.id}`).then(label => {
    _updateLabel(user.id, label.id, {
      name: `Updated label ${user.id}`,
    }).then(() => {
      _showLabel(user.id, label.id).then(label => {
        t.true(ajv.validate(labelResponseSchema, label));
        t.is(label.name, `Updated label ${user.id}`);
        t.is(label.priority, 0);
        t.true(label.visibled);
        t.end();
      });
    });
  });
});

test.cb('updateLabelHandler > update visibled', t => {
  const user = t.context.users[0];

  _createLabel(user.id, `Test label ${user.id}`).then(label => {
    _updateLabel(user.id, label.id, {
      visibled: false,
    }).then(() => {
      _showLabel(user.id, label.id).then(label => {
        t.true(ajv.validate(labelResponseSchema, label));
        t.is(label.name, `Test label ${user.id}`);
        t.is(label.priority, 0);
        t.false(label.visibled);
        t.end();
      });
    });
  });
});

test.cb('destroyLabelHandler', t => {
  const user = t.context.users[0];

  new Promise(resolve => {
    _createLabel(user.id, `Test label ${user.id}`).then(label => {
      _indexLabel(user.id).then(labels => {
        t.true(ajv.validate({
          type: 'array',
          items: labelResponseSchema,
        }, labels));
        t.is(labels.length, 1);

        _destroyLabel(user.id, label.id).then(destroyedLabel => {
          t.true(ajv.validate(labelResponseSchema, destroyedLabel));
          resolve();
        });
      });
    });
  }).then(() => {
    _indexLabel(user.id).then(labels_ => {
      t.is(labels_.length, 0);
      t.end();
    });
  });
});

test.cb('destroyLabelHandler', t => {
  const user = t.context.users[0];

  new Promise(resolve => {
    _createLabel(user.id, `Test label ${user.id}`).then(label1 => {
      _createLabel(user.id, `Test label ${user.id}`).then(label2 => {
        _destroyLabel(user.id, label1.id).then(destroyedLabel => {
          t.true(ajv.validate(labelResponseSchema, destroyedLabel));
          resolve(label2);
        });
      });
    });
  }).then(label2 => {
    _indexLabel(user.id).then(labels_ => {
      t.is(labels_.length, 1);
      t.is(labels_[0].priority, 0);
      t.is(labels_[0].name, label2.name);
      t.end();
    });
  });
});

test.cb('sortLabelHandler', t => {
  const user = t.context.users[0];

  new Promise(resolve => {
    _createLabel(user.id, '0').then(label => {
      _createLabel(user.id, '1').then(() => {
        _createLabel(user.id, '2').then(() => {
          _sortLabel(user.id, label.id, 2).then(resolve);
        });
      });
    });
  }).then(labels => {
    t.is(labels.length, 3);
    t.true(ajv.validate({
      type: 'array',
      items: labelResponseSchema,
    }, labels));
    t.is(labels[0].priority, 0);
    t.is(labels[0].name, '1');
    t.is(labels[1].priority, 1);
    t.is(labels[1].name, '2');
    t.is(labels[2].priority, 2);
    t.is(labels[2].name, '0');
    t.end();
  });
});

test.cb('sortLabelHandler', t => {
  const user = t.context.users[0];

  new Promise(resolve => {
    _createLabel(user.id, '0').then(() => {
      _createLabel(user.id, '1').then(() => {
        _createLabel(user.id, '2').then(label => {
          _sortLabel(user.id, label.id, 0).then(resolve);
        });
      });
    });
  }).then(labels => {
    t.is(labels.length, 3);
    t.true(ajv.validate({
      type: 'array',
      items: labelResponseSchema,
    }, labels));
    t.is(labels[0].priority, 0);
    t.is(labels[0].name, '2');
    t.is(labels[1].priority, 1);
    t.is(labels[1].name, '0');
    t.is(labels[2].priority, 2);
    t.is(labels[2].name, '1');
    t.end();
  });
});
