import {
  Label,
  Member,
  Request,
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
    text: task.text,
    content: task.content,
    priority: task.priority,
    completed: task.completed,
    schedule: task.schedule,
    errors: [],
  };
}

function mapLabel(label: any) {
  return {
    id: label.id,
    name: label.name,
    priority: label.priority,
    visibled: label.visibled,
    errors: [],
  };
}

function mapRequest(request: any) {
  return {
    id: request.id,
    memberName: request.memberName,
    labelName: request.labelName,
    status: request.status,
    errors: [],
  };
}

export function fetchInitialData(defaults: any, dispatch: (action: any) => void, options: any) {
  return new Promise((resolve, reject) => {
    Promise.all([
      User.find(options),
      Task.fetch({}, options),
      Label.fetch({}, options),
      Request.fetch({status: ['pending']}, options),
      Member.fetch(options),
    ]).then((values) => {
      const user: any = values[0];
      const tasks: any = values[1];
      const labels: any = values[2];
      const requests: any = values[3];
      const members: any = values[4];

      const action = {
        type: '__FETCH_INITIAL_DATA',
        isAuthenticated: true,
        user: mapUser(user),
        tasks: tasks.map((task: any) => mapTask(task)),
        labels: labels.map((label: any) => mapLabel(label)),
        requests: requests.map((request: any) => mapRequest(request)),
        members: members.map((member: any) => mapUser(member)),
        selectedTaskId: defaults.selectedTaskId || null,
        selectedLabelId: defaults.selectedLabelId || null,
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

export function deleteUser(dispatch: (action: any) => void, options: any) {
  return new Promise((resolve, reject) => {
    User.delete(options).then((user) => {
      resolve();
    }).catch(() => {
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

export function updateTask(
  dispatch: (action: any) => void,
  id: number,
  params: {completed?: boolean; content?: string; labelId?: number; },
  options: any,
) {
  return new Promise((resolve, reject) => {
    Task.update(id, params, options).then((task: any) => {
      const action = {
        type: '__UPDATE_TASK',
        task,
      };
      dispatch(action);
    });
  });
}

export function deleteTask(
  dispatch: (action: any) => void,
  id: number,
  options: any,
) {
  return new Promise((resolve, reject) => {
    Task.delete(id, options).then((task: any) => {
      const action = {
        type: '__DELETE_TASK',
        taskId: task.id,
      };
      dispatch(action);
    });
  });
}

export function sortTask(
  dispatch: (action: any) => void,
  id: number,
  to: number,
  options: any,
) {
  return new Promise((resolve, reject) => {
    Task.sort(id, to, options).then((tasks) => {
      const action = {
        type: '__SORT_TASK',
        tasks,
      };
      dispatch(action);
    });
  });
}

// Label
export function createLabel(
  dispatch: (action: any) => void,
  params: {name: string; },
  options: any,
) {
  return new Promise((resolve, reject) => {
    Label.create(params, options).then((label) => {
      const action = {
        type: '__CREATE_LABEL',
        label,
      };
      dispatch(action);
    });
  });
}

export function createLabelWithRequest(
  dispatch: (action: any) => void,
  labelParams: {name: string; },
  requestParams: {memberNames: string[]; },
  options: any,
) {
  return new Promise((resolve, reject) => {
    Label.create(labelParams, options).then((label: any) => {
      Promise.all(
        requestParams.memberNames.map((memberName: string) => {
          return Request.create({
            labelId: label.id,
            memberName,
          }, options);
        }),
      ).then((values: any) => {
        console.log(values);
      });
    });
  });
}

export function updateLabel(
  dispatch: (action: any) => void,
  id: number,
  params: {visibled?: boolean; name?: string},
  options: any,
) {
  return new Promise((resolve, reject) => {
    Label.update(id, params, options).then((label: any) => {
      const action = {
        type: '__UPDATE_LABEL',
        label,
      };
      dispatch(action);
    });
  });
}

export function updateLabelWithRequest(
  dispatch: (action: any) => void,
  id: number,
  labelParams: {visibled?: boolean; name?: string; },
  requestParams: {memberNames: string[]; },
  options: any,
) {
  return new Promise((resolve, reject) => {
    Label.update(id, labelParams, options).then((label: any) => {
      Promise.all(
        requestParams.memberNames.map((memberName: string) => {
          return Request.create({
            labelId: label.id,
            memberName,
          }, options);
        }),
      );
    });
  });
}

export function deleteLabel(
  dispatch: (action: any) => void,
  id: number,
  options: any,
) {
  return new Promise((resolve, reject) => {
    Label.delete(id, options).then((label: any) => {
      const action = {
        type: '__DELETE_LABEL',
        labelId: label.id,
      };
      dispatch(action);
    });
  });
}

export function sortLabel(
  dispatch: (action: any) => void,
  id: number,
  to: number,
  options: any,
) {
  return new Promise((resolve, reject) => {
    Label.sort(id, to, options).then((labels) => {
      const action = {
        type: '__SORT_LABEL',
        labels,
      };
      dispatch(action);
    });
  });
}

export function updateRequest(
  dispatch: (action: any) => void,
  id: number,
  params: {status?: string; },
  options: any,
) {
  return new Promise((resolve, reject) => {
    Request.update(id, params, options).then((request: any) => {
      const action = {
        type: '__UPDATE_REQUEST',
        request,
      };
      dispatch(action);
    });
  });
}
