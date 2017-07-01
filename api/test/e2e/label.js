const test = require('ava');
const uuid = require('uuid/v4');
const axios = require('axios');
const Ajv = require('ajv');

const models = require('../../../src/models');
const labelResponseSchema = require('../../schemes/label-response-scheme');

const ajv = new Ajv();
const req = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
});

test.cb.beforeEach(t => {
  Promise.all([
    req.post('/tokens', {uid: uuid(), provider: 'facebook', username: `test user ${uuid()}`}),
    req.post('/tokens', {uid: uuid(), provider: 'facebook', username: `test user ${uuid()}`}),
    req.post('/tokens', {uid: uuid(), provider: 'facebook', username: `test user ${uuid()}`}),
  ]).then(tokens => {
    Promise.all([
      req.get('/users/current', {headers: {Authorization: `Bearer ${tokens[0].data.accessToken}`}}),
      req.get('/users/current', {headers: {Authorization: `Bearer ${tokens[1].data.accessToken}`}}),
      req.get('/users/current', {headers: {Authorization: `Bearer ${tokens[2].data.accessToken}`}}),
    ]).then(users => {
      t.context.users = users.map((user, index) => {
        return {
          id: user.data.id,
          username: user.data.username,
          req: axios.create({
            baseURL: 'http://localhost:3000/api/v1/',
            headers: {Authorization: `Bearer ${tokens[index].data.accessToken}`},
          }),
        };
      });
      t.end();
    }).catch(() => t.end());
  }).catch(() => {
    t.fail('Need run api server. For example, `NODE_ENV=test npm run dev` and so on.');
    t.end();
  });
});

test.cb('fetchCurrentUserHandler > fetch labels', t => {
  const user = t.context.users[0];
  const user2 = t.context.users[1];

  // FIXME: If use promise all, `count is same`. I need to fix it. Cause is label-handlers/createLabelHandler
  new Promise(resolve => {
    user.req.post('/labels', {
      name: `Test label ${user.id}`,
      users: [user2.username],
    }).then(() => {
      user.req.post('/labels', {
        name: `Test label ${user.id}`,
      }).then(resolve);
    });
  }).then(() => {
    user.req.get('/labels').then(res => {
      const labels = res.data;
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
    user.req.post('/labels', {
      name: `Test label ${user.id}`,
      users: [user2.username],
    }).then(() => {
      user.req.post('/labels', {
        name: `Test label ${user.id}`,
      }).then(() => {
        user2.req.post('/labels', {
          name: `Test label ${user2.id}`,
        }).then(() => {
          user2.req.post('/labels', {
            name: `Test label ${user2.id}`,
            users: [user.username],
          }).then(resolve);
        });
      });
    });
  }).then(() => {
    models.Request.findOne({
      where: {
        userId: user.id,
        status: 'pending',
      },
    }).then(() => {
      models.Request.findOne({
        where: {sharedUserId: user.id, status: 'pending'},
      }).then(request => {
        request.accept().then(() => {
          user.req.get('/labels').then(res => {
            const labels = res.data;
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
});

test.cb('createLabelHandler > Create label without shared users', t => {
  const user = t.context.users[0];

  user.req.post('/labels', {
    name: `Test label ${user.id}`,
  }).then(res => {
    const label = res.data;
    t.true(ajv.validate(labelResponseSchema, label));
    t.is(label.name, `Test label ${user.id}`);
    t.is(label.priority, 0);
    t.is(label.sharedUsers.length, 0);
    t.true(label.visibled);
    t.end();
  }).catch(() => t.end());
});

test.cb('createLabelHandler > Create label with shared users', t => {
  const user = t.context.users[0];
  const user2 = t.context.users[1];

  user.req.post('/labels', {
    name: `Test label ${user.id}`,
    users: [user2.username],
  }).then(res => {
    const label = res.data;
    t.true(ajv.validate(labelResponseSchema, label));
    t.is(label.name, `Test label ${user.id}`);
    t.is(label.priority, 0);
    t.is(label.sharedUsers.length, 1);
    t.true(label.visibled);
    t.end();
  }).catch(() => t.end());
});

test.cb('createLabelHandler > Create label with shared 2 users', t => {
  const user = t.context.users[0];
  const user2 = t.context.users[1];
  const user3 = t.context.users[2];

  user.req.post('/labels', {
    name: `Test label ${user.id}`,
    users: [user2.username, user3.username],
  }).then(res => {
    const label = res.data;
    t.true(ajv.validate(labelResponseSchema, label));
    t.is(label.name, `Test label ${user.id}`);
    t.is(label.priority, 0);
    t.true(label.visibled);
    t.is(label.sharedUsers.length, 2);
    t.end();
  }).catch(() => t.end());
});

test.cb('createLabelHandler > Create label with share not existed user', t => {
  const user = t.context.users[0];

  user.req.post('/labels', {
    name: `Test label ${user.id}`,
    users: ['not existed user'],
  }).then(res => {
    const label = res.data;
    t.true(ajv.validate(labelResponseSchema, label));
    t.is(label.name, `Test label ${user.id}`);
    t.is(label.priority, 0);
    t.true(label.visibled);
    t.is(label.sharedUsers.length, 2);
    t.end();
  }).catch(err => {
    t.is(err.response.data, 'Include not existed user');
    t.end();
  });
});
