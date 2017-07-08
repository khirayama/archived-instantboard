import * as React from 'react';

import {BackLink} from '../../libs/web-storyboard/back-link';

import Container from '../container';

export default class MemberStoryboard extends Container<any, any> {
  public static propTypes = {};

  public render() {
    return (
      <section className="storyboard">
        <h1>MemberStoryboard</h1>
        <BackLink>Back</BackLink>
      </section>
    );
  }
}
