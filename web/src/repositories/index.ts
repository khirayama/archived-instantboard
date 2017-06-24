import axios from 'axios';
import * as pino from 'pino';

const logger = pino();

const req = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
});

// Login status
export const LoginStatus = {
  get: (accessToken: string) => {
    return new Promise((resolve) => {
      req.get('/login-status', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(({data}) => {
        resolve(data);
      }).catch((err) => logger.info(err));
    });
  },
};

// Token
export const Token = {
  create: (params: any) => {
    return new Promise((resolve) => {
      req.post('/tokens', params).then(({data}) => {
        resolve(data);
      }).catch((err) => logger.info(err));
    });
  },
};

// User
export const User = {
  get: (accessToken: string) => {
    return new Promise((resolve) => {
      req.get('/users/current', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(({data}) => {
        resolve(data);
      }).catch((err) => logger.info(err));
    });
  },
};
