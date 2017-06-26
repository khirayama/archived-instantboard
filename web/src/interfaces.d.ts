declare module 'browser-cookies' {
  export function get(key: string): any;
  export function set(key: string, value: string): any;
}

interface IRequestOptions {
  accessToken: string;
}

interface IState {
  isAuthenticated: boolean;
  user: any;
  tasks: any[];
}

interface IAction {
  type: string;
  isAuthenticated: boolean;
  user: any|null;
  tasks: any[];
}
