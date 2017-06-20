import * as pino from 'pino';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {segues, storyboards} from './config/stories';
import {Navigator, Router} from './libs/web-storyboard';
import store from './store';

const logger = pino();

window.addEventListener('DOMContentLoaded', () => {
  logger.info(`Start app at ${new Date()}.`);

  const applicationElement = document.querySelector('.application');
  const router = new Router(segues, storyboards);

  if (applicationElement) {
    ReactDOM.render((
      <Navigator
        path={window.location.pathname}
        router={router}
        store={store}
      />
    ), applicationElement);
  }
});
