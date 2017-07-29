import * as PropTypes from 'prop-types';
import * as React from 'react';

import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

import {Icon} from '../../components/icon';
import {
  TabNavigation,
  TabNavigationContentList,
  TabNavigationContentListItem,
  TabNavigationTabList,
  TabNavigationTabListItem,
} from '../../components/tab-navigation';

import {LabelsTabContent} from './labels-tab-content';
import {RequestsTabContent} from './requests-tab-content';
import {TasksTabContent} from './tasks-tab-content';
import {UserTabContent} from './user-tab-content';

import {
  deleteLabel,
  deleteTask,
  sortLabel,
  sortTask,
  updateLabel,
  updateRequest,
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

  public acceptRequest(requestId: number) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    updateRequest(dispatch, requestId, {status: 'accepted'}, {accessToken: this.accessToken});
  }

  public refuseRequest(requestId: number) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    updateRequest(dispatch, requestId, {status: 'refused'}, {accessToken: this.accessToken});
  }

  public render() {
    const actions = {
      updateLabel: this.updateLabel.bind(this),
      deleteLabel: this.deleteLabel.bind(this),
      sortLabel: this.sortLabel.bind(this),
      updateTask: this.updateTask.bind(this),
      deleteTask: this.deleteTask.bind(this),
      sortTask: this.sortTask.bind(this),
      acceptRequest: this.acceptRequest.bind(this),
      refuseRequest: this.refuseRequest.bind(this),
    };
    const user = this.state.user || {};
    const labels = this.state.labels;
    const tasks = this.state.tasks;
    const requests = this.state.requests;
    const members = this.state.members;

    function loadTabIndex(): number {
      let index = 0;
      if (typeof window === 'object' && window.sessionStorage) {
        index = Number(window.sessionStorage.getItem('_tab_navigatgion_index'));
      }
      return index;
    }

    function saveTabIndex(index: number): void {
      if (typeof window === 'object' && window.sessionStorage) {
        window.sessionStorage.setItem('_tab_navigatgion_index', String(index));
      }
    }

    return (
      <section className="storyboard">
        <TabNavigation
          initialIndex={loadTabIndex()}
          onChange={(index: number) => {
            this.tabIndex = index;
            saveTabIndex(index);
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
              <RequestsTabContent
                requests={requests}
                actions={actions}
              />
            </TabNavigationContentList>

            <TabNavigationContentList index={3}>
              <UserTabContent
                user={user}
                actions={actions}
              />
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
