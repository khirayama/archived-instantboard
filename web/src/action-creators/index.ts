import {
  LoginStatus,
  Token,
  User,
} from '../repositories';

function initializeMainStoryboard(params: any, args: any, payload: any) {
  return new Promise((resolve) => {
    LoginStatus.get(payload.accessToken).then(({status}) => {
      const action = {
        type: '__INITIALIZE_MAIN_STORYBOARD',
        isAuthenticated: (status === 'connected'),
      };
      payload.dispatch(action);
      resolve();
    });
  });
}

function createToken(params: {provider: string; uid: string; }) {
  return new Promise((resolve) => {
    Token.create(params).then(({accessToken}) => {
      User.get(accessToken).then((res) => {
        console.log(res);
        resolve(accessToken);
      });
    });
  });
}

export  {
  initializeMainStoryboard,
  createToken,
};
