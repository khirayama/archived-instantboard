import {
  LoginStatus,
  Token,
  User,
} from '../repositories';

function initializeMainStoryboard(params: any, args: any, payload: any) {
  return new Promise((resolve) => {
    LoginStatus.get(payload.accessToken).then(({status, user}) => {
      const action = {
        type: '__INITIALIZE_MAIN_STORYBOARD',
        isAuthenticated: (status === 'connected'),
        user,
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
        user,
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
          user,
        });
        resolve({accessToken, user});
      });
    });
  });
}

export  {
  initializeMainStoryboard,
  initializeNewUserStoryboard,
  createToken,
};
