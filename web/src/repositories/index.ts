import axios from 'axios';

const API_DOMAIN = 'http://localhost:3000';

// Token
export const Token = {
  req: axios.create({
    baseURL: `${API_DOMAIN}/api/v1/tokens`,
  }),
  create: (params: any) => {
    return new Promise((resolve, reject) => {
      Token.req.post('/', params).then(({data}) => {
        resolve(data);
      }).catch((err: any) => reject(err));
    });
  },
};

// User
export const User = {
  req: axios.create({
    baseURL: `${API_DOMAIN}/api/v1/users`,
  }),
  find: (options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      User.req.get('/current', {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then(({data}) => {
        resolve(data);
      }).catch((err: any) => reject(err));
    });
  },
  update: (params: any, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      User.req.put('/current', params, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then(({data}) => {
        resolve(data);
      }).catch((err: any) => reject(err));
    });
  },
};

// Task
export const Task = {
  req: axios.create({
    baseURL: `${API_DOMAIN}/api/v1/tasks`,
  }),
  fetch: (params: any = {}, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Task.req.get('/', {
        headers: {Authorization: `Bearer ${options.accessToken}`},
        params,
      }).then(({data}) => {
        resolve(data);
      }).catch((err: any) => reject(err));
    });
  },
  create: (params: {content: string; labelId: number; }, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Task.req.post('/', params, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => reject(err));
    });
  },
  update: (id: number, params: {completed?: boolean; content?: string; labelId?: number}, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Task.req.put(`/${id}`, params, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => reject(err));
    });
  },
  delete: (id: number, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Task.req.delete(`/${id}`, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => reject(err));
    });
  },
  sort: (id: number, to: number, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Task.req.put(`/${id}/sort`, {priority: to}, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => reject(err));
    });
  },
};

// Label
export const Label = {
  req: axios.create({
    baseURL: `${API_DOMAIN}/api/v1/labels`,
  }),
  fetch: (params: any = {}, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Label.req.get('/', {
        headers: {Authorization: `Bearer ${options.accessToken}`},
        params,
      }).then(({data}) => {
        resolve(data);
      }).catch((err: any) => reject(err));
    });
  },
  create: (params: {name: string; }, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Label.req.post('/', params, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => reject(err));
    });
  },
  update: (id: number, params: {visibled?: boolean; name?: string}, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Label.req.put(`/${id}`, params, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => reject(err));
    });
  },
  delete: (id: number, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Label.req.delete(`/${id}`, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => reject(err));
    });
  },
  sort: (id: number, to: number, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Label.req.put(`/${id}/sort`, {priority: to}, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => reject(err));
    });
  },
};

// Request
export const Request = {
  req: axios.create({
    baseURL: `${API_DOMAIN}/api/v1/requests`,
  }),
  fetch: (params: any = {}, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Request.req.get('/', {
        headers: {Authorization: `Bearer ${options.accessToken}`},
        params,
      }).then(({data}) => {
        resolve(data);
      }).catch((err: any) => reject(err));
    });
  },
  create: (params: any = {}, options: IRequestOptions) => {
    return new Promise((resolve, reject) => {
      Request.req.post('/', params, {
        headers: {Authorization: `Bearer ${options.accessToken}`},
      }).then(({data}) => {
        resolve(data);
      }).catch((err: any) => reject(err));
    });
  },
};
