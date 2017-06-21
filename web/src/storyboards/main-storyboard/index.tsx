import * as React from 'react';

import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

export default class MainStoryboard extends Container<any, any> {
  private propTypes = {};

  public render() {
    return (
      <section className="storyboard">
        <h1>MainStoryboard</h1>
        <Link href="/profile">Profile</Link>
      </section>
    );
  }
}
