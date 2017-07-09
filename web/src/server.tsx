import * as path from 'path';

import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as pino from 'pino';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import Store from './libs/circuit';

import {segues, storyboards} from './config/stories';
import {Navigator} from './libs/web-storyboard';
import Router from './libs/web-storyboard/router';

import {ACCESS_TOKEN_KEY} from './constants';
import reducer from './reducers';

const app = express();
const logger = pino();

function template(title: string, content: string, state: any) {
  return (`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>${title}</title>
    <!-- standalone for android-->
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="icon" sizes="192x192" href="/images/icon-android.png">
    <link rel="manifest" href="/manifest.json">
    <!-- standalone for ios-->
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Handle">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="apple-touch-icon" sizes="76x76" href="/images/icon-ios.png">
    <link rel="stylesheet" href="/index.css">
    <script src="/bundle.js" defer></script>
  </head>
  <body>
    <section class="application">${content}</section>
    <script>window.state = ${JSON.stringify(state)};</script>
  </body>
</html>
  `);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get([
  '/login',
  '/users/new',
  '/',
  '/tasks/new',
  '/tasks/:id/edit',
  '/labels/new',
  '/labels/:id/edit',
], (req, res) => {

  const initialState: any = {
    isAuthenticated: false,
    user: null,
    tasks: [],
    labels: [],
    requests: [],
  };
  const router = new Router(segues, storyboards);
  const store = new Store(initialState, reducer);

  res.send(
    template(
      'Debugging',
      ReactDOMServer.renderToString((
        <Navigator
        path={'/'}
        router={router}
        store={store}
        />
      )),
      store.getState(),
    ),
  );
  return;

  // router.initialize(req.path, {
  //   accessToken: req.cookies[ACCESS_TOKEN_KEY],
  //   dispatch: store.dispatch.bind(store),
  // }).then((result: any) => {
  //   const state = store.getState();
  //
  //   if (!state.isAuthenticated && req.path !== '/login') {
  //     res.redirect('/login');
  //   } else if (state.isAuthenticated && !state.user.username && req.path !== '/users/new') {
  //     res.redirect('/users/new');
  //   } else {
  //     res.send(
  //       template(
  //         result.title,
  //         ReactDOMServer.renderToString((
  //           <Navigator
  //             path={req.path}
  //             router={router}
  //             store={store}
  //             />
  //         )),
  //         store.getState(),
  //       ),
  //     );
  //   }
  // }).catch((err: any) => logger.error(err));
});

app.listen(3001, () => {
  logger.info('Example app listening on port 3001!');
});
