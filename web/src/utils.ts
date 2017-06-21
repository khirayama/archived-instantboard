import * as cookies from 'browser-cookies';

import {ACCESS_TOKEN_KEY} from './constants';

export function extractAccessToken() {
  return cookies.get(ACCESS_TOKEN_KEY) || '';
}

export function setAccessToken(accessToken: string) {
  cookies.set(ACCESS_TOKEN_KEY, accessToken);
}
