import * as PropTypes from 'prop-types';
import * as React from 'react';

import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

import {
  Tab,
  TabContent,
  TabContents,
  TabNavigation,
  Tabs,
} from '../../components/tab-navigation';
import {Icon} from '../../components/icon';

import {TasksTabContent} from './tasks-tab-content';

import {
  deleteLabel,
  deleteTask,
  sortLabel,
  sortTask,
  updateLabel,
  updateTask,
} from '../../action-creators';

const sort = {
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
          return <LabelListItem key={label.id} label={label} actions={this.props.actions}/>;
        })}
      </ul>
    );
  }
}

export default class MainStoryboard extends Container<any, any> {
  public static propTypes = {};
  public static contextTypes = {
    move: PropTypes.func,
  };

  private tabIndex: number;

  constructor(props: any) {
    super(props);

    this.tabIndex = 0;
  }

  public handleClickAddButton(event: any) {
    if (this.tabIndex === 1) {
      this.context.move('/labels/new');
    } else {
      this.context.move('/tasks/new');
    }
  }

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
    const labels = this.state.labels;
    const tasks = this.state.tasks;
    const requests = this.state.requests;
    const user = this.state.user || {};

    return (
      <section className="storyboard">
        <TabNavigation onChange={(index: number) => {
          this.tabIndex = index;
        }}>
          <TabContents>
            <TabContent index={0}>
              <TasksTabContent
                labels={labels}
                tasks={tasks}
                actions={actions}
              />
            </TabContent>

            <TabContent index={1}>
              <LabelList
                labels={labels}
                actions={actions}
              />
            </TabContent>

            <TabContent index={2}>
              <ul>
                {requests.map((request: any) => {
                  return <li key={request.id}>from {request.username}</li>;
                })}
              </ul>
            </TabContent>

            <TabContent index={3}>
              <div>
                {user.username}
              </div>
            </TabContent>
          </TabContents>
          <Tabs>
            <Tab index={0}><Icon>view_list</Icon></Tab>
            <Tab index={1}><Icon>label</Icon></Tab>
            <Tab><div onClick={(event: any) => this.handleClickAddButton(event)}><Icon>add_box</Icon></div></Tab>
            <Tab index={2}><Icon>notifications</Icon></Tab>
            <Tab index={3}><Icon>person</Icon></Tab>
          </Tabs>
        </TabNavigation>
      </section>
    );
  }
}
