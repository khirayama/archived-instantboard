import * as React from 'react';

import {BackLink} from '../../libs/web-storyboard/back-link';

import Container from '../container';

export default class ProfileStoryboard extends Container<any, any> {
  private propTypes = {};

  public render() {
    return (
      <section className="storyboard">
        <h1>ProfileStoryboard</h1>
        <BackLink>Back</BackLink>
      </section>
    );
  }
}
