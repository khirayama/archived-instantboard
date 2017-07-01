const test = require('ava');
const uuid = require('uuid/v4');
const Ajv = require('ajv');
const jwt = require('jwt-simple');

const {SECRET_KEY} = require('../../src/constants');
const models = require('../../src/models');
const {_createToken} = require('../../src/handlers/token-handlers');
const {
  _fetchLabel,
  _fetchLabels,
  _createLabel,
  _updateLabel,
  _destroyLabel,
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
  }).catch(() => {
    t.fail('Need run api server. For example, `NODE_ENV=test npm run dev` and so on.');
    t.end();
  });
});

test.cb('_fetchLabels > fetch labels', t => {
  const user = t.context.users[0];
  const user2 = t.context.users[1];

  // FIXME: If use promise all, `count is same`. I need to fix it. Cause is label-handlers/createLabelHandler
  new Promise(resolve => {
    _createLabel(user.id, `Test label ${user.id}`, [user2.username]).then(() => {
      _createLabel(user.id, `Test label ${user.id}`).then(resolve);
    });
  }).then(() => {
    _fetchLabels(user.id).then(labels => {
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
        _fetchLabels(user.id).then(labels => {
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
      _fetchLabel(user.id, label.id).then(label => {
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
      _fetchLabel(user.id, label.id).then(label => {
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

  _createLabel(user.id, `Test label ${user.id}`).then(label => {
    _fetchLabels(user.id).then(labels => {
      t.true(ajv.validate({
        type: 'array',
        items: labelResponseSchema,
      }, labels));
      t.is(labels.length, 1);

      _destroyLabel(user.id, label.id).then(destroyedLabel => {
        t.true(ajv.validate(labelResponseSchema, destroyedLabel));

        _fetchLabels(user.id).then(labels_ => {
          t.is(labels_.length, 0);
          t.end();
        });
      });
    });
  });
});
