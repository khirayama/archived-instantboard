import * as PropTypes from 'prop-types';
import * as React from 'react';

import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

import {
  TabNavigation,
  TabNavigationTabList,
  TabNavigationTabListItem,
  TabNavigationContentList,
  TabNavigationContentListItem,
} from '../../components/tab-navigation';
import {Icon} from '../../components/icon';

import {TasksTabContent} from './tasks-tab-content';
import {LabelsTabContent} from './labels-tab-content';

import {
  deleteLabel,
  deleteTask,
  sortLabel,
  sortTask,
  updateLabel,
  updateTask,
} from '../../action-creators';

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
          <TabNavigationContentListItem>
            <TabNavigationContentList index={0}>
              <TasksTabContent
                labels={labels}
                tasks={tasks}
                actions={actions}
              />
            </TabNavigationContentList>

            <TabNavigationContentList index={1}>
              <LabelsTabContent
                labels={labels}
                actions={actions}
              />
            </TabNavigationContentList>

            <TabNavigationContentList index={2}>
              <ul>
                {requests.map((request: any) => {
                  return <li key={request.id}>from {request.username}</li>;
                })}
              </ul>
            </TabNavigationContentList>

            <TabNavigationContentList index={3}>
              <div>
                {user.username}
              </div>
            </TabNavigationContentList>
          </TabNavigationContentListItem>
          <TabNavigationTabList>
            <TabNavigationTabListItem index={0}><Icon>view_list</Icon></TabNavigationTabListItem>
            <TabNavigationTabListItem index={1}><Icon>label</Icon></TabNavigationTabListItem>
            <TabNavigationTabListItem><div onClick={(event: any) => this.handleClickAddButton(event)}><Icon>add_box</Icon></div></TabNavigationTabListItem>
            <TabNavigationTabListItem index={2}><Icon>notifications</Icon></TabNavigationTabListItem>
            <TabNavigationTabListItem index={3}><Icon>person</Icon></TabNavigationTabListItem>
          </TabNavigationTabList>
        </TabNavigation>
      </section>
    );
  }
}
