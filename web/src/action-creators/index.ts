import {
  LoginStatus,
  Token,
  User,
} from '../repositories';

function mapUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    errors: [],
  };
}

function initializeMainStoryboard(params: any, args: any, payload: any) {
  return new Promise((resolve) => {
    LoginStatus.get(payload.accessToken).then(({status, user}) => {
      const action = {
        type: '__INITIALIZE_MAIN_STORYBOARD',
        isAuthenticated: (status === 'connected'),
        user: mapUser(user),
      };
      payload.dispatch(action);
      resolve();
    });
  });
}

function initializeNewUserStoryboard(params: any, args: any, payload: any) {
  return new Promise((resolve) => {
    LoginStatus.get(payload.accessToken).then(({status, user}) => {
      const action = {
        type: '__INITIALIZE_NEW_USER_STORYBOARD',
        isAuthenticated: (status === 'connected'),
        user: mapUser(user),
      };
      payload.dispatch(action);
      resolve();
    });
  });
}

function createToken(params: {provider: string; uid: string; }, payload: any) {
  return new Promise((resolve) => {
    Token.create(params).then(({accessToken}) => {
      User.get(accessToken).then((user) => {
        payload.dispatch({
          type: '__CREATE_TOKEN',
          isAuthenticated: true,
          user: mapUser(user),
        });
        resolve({accessToken, user});
      });
    });
  });
}

function updateUser(params: {username: string;}, payload: any) {
  return new Promise((resolve, reject) => {
    User.update(payload.accessToken, params).then((res) => {
      payload.dispatch({
        type: '__UPDATE_USER',
        user: Object.assign({errors: []}, params),
      });
      resolve();
    }).catch(() => {
      payload.dispatch({
        type: '__FAILURE_UPDATE_USER',
        error: 'Already existed',
      });
      reject();
    });
  });
}

export  {
  initializeMainStoryboard,
  initializeNewUserStoryboard,
  createToken,
  updateUser,
};
