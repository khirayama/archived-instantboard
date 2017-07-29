import * as cookies from 'browser-cookies';

import {ACCESS_TOKEN_KEY} from './constants';

export function clearAccessToken() {
  cookies.set(ACCESS_TOKEN_KEY, '');
}

export function extractAccessToken() {
  if (typeof window === 'object') {
    return cookies.get(ACCESS_TOKEN_KEY) || '';
  }
  return '';
}

export function setAccessToken(accessToken: string) {
  cookies.set(ACCESS_TOKEN_KEY, accessToken);
}
