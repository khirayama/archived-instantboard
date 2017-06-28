import * as React from 'react';

import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

import {
  updateLabel,
  deleteLabel,
  sortLabel,
} from '../../action-creators';

let sort = {
  id: null,
  to: null,
};

class LabelListItem extends React.Component<any, any> {
  public handleClickVisibleButton() {
    const label = this.props.label;
    this.props.actions.updateLabel(label.id, {visibled: !label.visibled});
  }

  public handleClickDeleteButton() {
    const label = this.props.label;
    this.props.actions.deleteLabel(label.id);
  }

  public handleDragEnd() {
    this.props.actions.sortLabel(sort.id, sort.to);
    sort.id = null;
    sort.to = null;
  }

  public render() {
    const label = this.props.label;
    return (
      <li
        draggable
        onDragStart={() => sort.id = label.id}
        onDragEnter={() => sort.to = label.priority}
        onDragEnd={() => this.handleDragEnd()}
      >
        <span>{label.priority} {label.name}</span>
        <span onClick={() => this.handleClickDeleteButton()}>[DELETE]</span>
        <span onClick={() => this.handleClickVisibleButton()}>[{(label.visibled) ? 'UNVISIBLE' : 'VISIBLE'}]</span>
      </li>
    );
  }
}

class LabelList extends React.Component<any, any> {
  public render() {
    return (
      <ul>
        {this.props.labels.map((label: any) => {
          return <LabelListItem key={label.id} label={label} actions={this.props.actions}/>
        })}
      </ul>
    );
  }
}

export default class MainStoryboard extends Container<any, any> {
  public static propTypes = {};

  public updateLabel(labelId: number, label: any) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    updateLabel(dispatch, labelId, label, {accessToken: this.accessToken});
  }

  public deleteLabel(labelId: number) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    deleteLabel(dispatch, labelId, {accessToken: this.accessToken});
  }

  public sortLabel(labelId: number, to: number) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    sortLabel(dispatch, labelId, to, {accessToken: this.accessToken});
  }

  public render() {
    const actions = {
      updateLabel: this.updateLabel.bind(this),
      deleteLabel: this.deleteLabel.bind(this),
      sortLabel: this.sortLabel.bind(this),
    };
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
          <LabelList
            labels={this.state.labels}
            actions={actions}
          />
          <Link href="/labels/new">New Labels</Link>
        </div>
      </section>
    );
  }
}
