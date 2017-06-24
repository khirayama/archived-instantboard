import * as React from 'react';

import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

export default class MainStoryboard extends Container<any, any> {
  public static propTypes = {};

  public render() {
    return (
      <section className="storyboard">
        <h1>MainStoryboard</h1>
        <div>
          <Link href="/tasks/new">New Tasks</Link>
        </div>
        <div>
          <Link href="/labels/new">New Labels</Link>
        </div>
      </section>
    );
  }
}
