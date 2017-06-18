import * as React from 'react';
import * as ReactDOM from 'react-dom';

import store from 'store';

window.addEventListener('DOMContentLoaded', () => {
  console.log(`Start app at ${new Date()}.`);

  console.log(store.getState());

  const applicationElement = document.querySelector('.application');

  if (applicationElement) {
    ReactDOM.render((
      <h1>Hell</h1>
    ), applicationElement);
  }
});
