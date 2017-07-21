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
  labels: any[];
  requests: any[];
  selectedTaskId: any;
  selectedLabelId: any;
}
