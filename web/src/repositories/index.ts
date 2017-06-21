import axios from 'axios';

const req = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
});

// Login status
export const LoginStatus = {
  get: (accessToken: string) => {
    return new Promise(resolve => {
      req.get('/login-status', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(({data}) => {
        resolve(data);
      }).catch(err => console.log(err));
    });
  },
};

// Token
export const Token = {
  create: (params: any) => {
    return new Promise(resolve => {
      req.post('/tokens', params).then(({data}) => {
        resolve(data);
      }).catch(err => console.log(err));
    });
  },
};
