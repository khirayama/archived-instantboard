import {LoginStatus} from '../repositories';
import {Token} from '../repositories';

function initializeMainStoryboard(params: any, args: any, payload: any) {
  return new Promise(resolve => {
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

function initializeProfileStoryboard(params: any, args: any, payload: any) {
  return new Promise(resolve => {
    LoginStatus.get(payload.accessToken).then(({status}) => {
      const action = {
        type: '__INITIALIZE_PROFILE_STORYBOARD',
        isAuthenticated: (status === 'connected'),
      };
      payload.dispatch(action);
      resolve();
    });
  });
}

function createToken(params: {provider: string; uid: string;}) {
  return new Promise((resolve) => {
    Token.create(params).then(({accessToken}) => {
      resolve(accessToken);
    });
  });
}

export  {
  initializeMainStoryboard,
  initializeProfileStoryboard,
  createToken,
};
