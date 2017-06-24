import axios from 'axios';
import * as pino from 'pino';

const logger = pino();

const req = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
});

// Login status
export const LoginStatus = {
  get: (accessToken: string) => {
    return new Promise((resolve, reject) => {
      req.get('/login-status', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(({data}) => {
        resolve(data);
      }).catch((err) => reject(err));
    });
  },
};

// Token
export const Token = {
  create: (params: any) => {
    return new Promise((resolve, reject) => {
      req.post('/tokens', params).then(({data}) => {
        resolve(data);
      }).catch((err) => reject(err));
    });
  },
};

// User
export const User = {
  get: (accessToken: string) => {
    return new Promise((resolve, reject) => {
      req.get('/users/current', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(({data}) => {
        resolve(data);
      }).catch((err) => reject(err));
    });
  },
  update: (accessToken: string, params: any) => {
    return new Promise((resolve, reject) => {
      req.put('/users/current', params, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(({data}) => {
        resolve(data);
      }).catch((err) => reject(err));
    });
  },
};
