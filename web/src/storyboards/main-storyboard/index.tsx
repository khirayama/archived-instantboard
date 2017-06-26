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
          <ul>
            {this.state.tasks.map((task: any, index: number) => <li key={index}>{task.content}</li>)}
          </ul>
          <Link href="/tasks/new">New Tasks</Link>
        </div>
        <div>
          <ul>
            {this.state.labels.map((label: any, index: number) => <li key={index}>{label.name}</li>)}
          </ul>
          <Link href="/labels/new">New Labels</Link>
        </div>
      </section>
    );
  }
}
