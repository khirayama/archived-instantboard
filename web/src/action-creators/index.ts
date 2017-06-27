import {
  Label,
  Task,
  Token,
  User,
} from '../repositories';

// Utils
function mapUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    errors: [],
  };
}

function mapTask(task: any) {
  return {
    id: task.id,
    labelId: task.labelId,
    content: task.content,
    priority: task.priority,
    completed: task.completed,
    errors: [],
  };
}

function mapLabel(label: any) {
  return {
    id: label.id,
    name: label.name,
    priority: label.priority,
    errors: [],
  };
}

export function fetchInitialData(dispatch: (action: any) => void, options: any) {
  return new Promise((resolve, reject) => {
    Promise.all([
      User.find(options),
      Task.fetch(options),
      Label.fetch(options),
      Label.fetchSharedLabel(options),
    ]).then((values) => {
      const user: any = values[0];
      const tasks: any = values[1];
      const labels: any = values[2];

      const action = {
        type: '__FETCH_INITIAL_DATA',
        isAuthenticated: true,
        user: mapUser(user),
        tasks: tasks.map((task: any) => mapTask(task)),
        labels: labels.map((label: any) => mapLabel(label)),
      };
      dispatch(action);
      resolve();
    }).catch(() => {
      const action = {
        type: '__FAILURE_FETCH_INITIAL_DATA',
        isAuthenticated: false,
      };
      dispatch(action);
      reject();
    });
  });
}

// Token
export function createToken(dispatch: (action: any) => void, params: {provider: string; uid: string; }) {
  return new Promise((resolve) => {
    Token.create(params).then(({accessToken}) => {
      User.find({accessToken}).then((user: any) => {
        const action = {
          type: '__CREATE_TOKEN',
          isAuthenticated: true,
          user: mapUser(user),
        };
        dispatch(action);
        resolve({accessToken, user});
      });
    });
  });
}

// User
export function updateUser(dispatch: (action: any) => void, params: {username: string; }, options: any) {
  return new Promise((resolve, reject) => {
    User.update(params, options).then((user) => {
      const action = {
        type: '__UPDATE_USER',
        user: mapUser(user),
      };
      dispatch(action);
      resolve();
    }).catch(() => {
      const action = {
        type: '__FAILURE_UPDATE_USER',
        user: mapUser(Object.assign({}, params, {errors: ['Already existed']})),
      };
      dispatch(action);
      reject();
    });
  });
}

// Task
export function createTask(
  dispatch: (action: any) => void,
  params: {content: string; labelId: number; },
  options: any,
) {
  return new Promise((resolve, reject) => {
    Task.create(params, options);
  });
}

// Label
export function createLabel(
  dispatch: (action: any) => void,
  params: {name: string; },
  options: any,
) {
  return new Promise((resolve, reject) => {
    Label.create(params, options);
  });
}
