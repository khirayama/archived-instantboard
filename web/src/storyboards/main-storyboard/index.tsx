import * as React from 'react';

import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

import {
  updateLabel,
  deleteLabel,
  sortLabel,
  updateTask,
  deleteTask,
  sortTask,
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
        <span onClick={() => this.handleClickVisibleButton()}>[{(label.visibled) ? ' to UNVISIBLE' : 'to VISIBLE'}]</span>
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

class TaskListItem extends React.Component<any, any> {
  public handleClickCompleteButton() {
    const task = this.props.task;
    this.props.actions.updateTask(task.id, {completed: !task.completed});
  }

  public handleClickDeleteButton() {
    const task = this.props.task;
    this.props.actions.deleteTask(task.id);
  }

  public handleDragEnd() {
    this.props.actions.sortTask(sort.id, sort.to);
    sort.id = null;
    sort.to = null;
  }

  public render() {
    const task = this.props.task;
    return (
      <li
        draggable
        onDragStart={() => sort.id = task.id}
        onDragEnter={() => sort.to = task.priority}
        onDragEnd={() => this.handleDragEnd()}
      >
        <span>{task.priority} {task.content}</span>
        <span onClick={() => this.handleClickDeleteButton()}>[DELETE]</span>
        <span onClick={() => this.handleClickCompleteButton()}>[{(task.completed) ? 'to COMPLETE' : 'to UNCOMPLETE'}]</span>
      </li>
    );
  }
}

class TaskList extends React.Component<any, any> {
  public render() {
    return (
      <ul>
        {this.props.tasks.map((task: any) => {
          return <TaskListItem key={task.id} task={task} actions={this.props.actions}/>
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

  public updateTask(taskId: number, task: any) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    updateTask(dispatch, taskId, task, {accessToken: this.accessToken});
  }

  public deleteTask(taskId: number) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    deleteTask(dispatch, taskId, {accessToken: this.accessToken});
  }

  public sortTask(taskId: number, to: number) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    sortTask(dispatch, taskId, to, {accessToken: this.accessToken});
  }

  public render() {
    const actions = {
      updateLabel: this.updateLabel.bind(this),
      deleteLabel: this.deleteLabel.bind(this),
      sortLabel: this.sortLabel.bind(this),
      updateTask: this.updateTask.bind(this),
      deleteTask: this.deleteTask.bind(this),
      sortTask: this.sortTask.bind(this),
    };
    return (
      <section className="storyboard">
        <h1>MainStoryboard</h1>
        <div>
          <ul>
            <TaskList
              tasks={this.state.tasks}
              actions={actions}
            />
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
