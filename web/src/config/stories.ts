// [LoginStoryboard]-----(show)---[NewUserStoryboard]---(temporary)---[MainStoryboard]---(temporary)---[TaskStoryboard]
//                    |                                                    |      |
//                    ----------------------(temporary)---------------------      |---(temporary)---[LabelStoryboard]---(show)---[Memberstoryboard]

import {segueTypes} from '../libs/web-storyboard/constants';

import LabelStoryboard from '../storyboards/label-storyboard';
import LoginStoryboard from '../storyboards/login-storyboard';
import MainStoryboard from '../storyboards/main-storyboard';
import MemberStoryboard from '../storyboards/member-storyboard';
import NewUserStoryboard from '../storyboards/new-user-storyboard';
import TaskStoryboard from '../storyboards/task-storyboard';

import {fetchInitialData} from '../action-creators';

const StoryboardKeys = {
  LoginStoryboard: 'Login Storyboard',
  NewUserStoryboard: 'New User Storyboard',
  MainStoryboard: 'Main Storyboard',
  TaskStoryboard: 'Task Storyboard',
  LabelStoryboard: 'Label Storyboard',
  MemberStoryboard: 'MemberStoryboard Storyboard',
};

export const segues = [{
  from: StoryboardKeys.LoginStoryboard,
  to: StoryboardKeys.NewUserStoryboard,
  type: segueTypes.show,
}, {
  from: StoryboardKeys.LoginStoryboard,
  to: StoryboardKeys.MainStoryboard,
  type: segueTypes.temporary,
}, {
  from: StoryboardKeys.NewUserStoryboard,
  to: StoryboardKeys.MainStoryboard,
  type: segueTypes.temporary,
}, {
  from: StoryboardKeys.MainStoryboard,
  to: StoryboardKeys.TaskStoryboard,
  type: segueTypes.temporary,
}, {
  from: StoryboardKeys.MainStoryboard,
  to: StoryboardKeys.LabelStoryboard,
  type: segueTypes.temporary,
}, {
  from: StoryboardKeys.LabelStoryboard,
  to: StoryboardKeys.MemberStoryboard,
  type: segueTypes.show,
}];

export const storyboards = [{
  key: StoryboardKeys.LoginStoryboard,
  component: LoginStoryboard,
  path: '/login',
  options: {
    title: 'Login | Instantboard',
  },
}, {
  key: StoryboardKeys.NewUserStoryboard,
  component: NewUserStoryboard,
  path: '/users/new',
  options: {
    initialize: (params: any, args: any, payload: any) => {
      return new Promise((resolve) => {
        fetchInitialData({}, payload.dispatch, {
          accessToken: payload.accessToken,
        });
        resolve();
      });
    },
    title: 'Register | Instantboard',
  },
}, {
  root: true,
  key: StoryboardKeys.MainStoryboard,
  component: MainStoryboard,
  path: '/',
  options: {
    initialize: (params: any, args: any, payload: any) => {
      return new Promise((resolve) => {
        fetchInitialData({}, payload.dispatch, {
          accessToken: payload.accessToken,
        }).then(resolve);
      });
    },
    title: 'Instantboard',
  },
}, {
  key: StoryboardKeys.TaskStoryboard,
  component: TaskStoryboard,
  path: '/tasks/new',
  options: {
    initialize: (params: any, args: any, payload: any) => {
      return new Promise((resolve) => {
        fetchInitialData({}, payload.dispatch, {
          accessToken: payload.accessToken,
        }).then(resolve);
      });
    },
    title: 'New task | Instantboard',
  },
}, {
  key: StoryboardKeys.TaskStoryboard,
  component: TaskStoryboard,
  path: '/tasks/:id/edit',
  options: {
    initialize: (params: any, args: any, payload: any) => {
      return new Promise((resolve) => {
        fetchInitialData({selectedTaskId: Number(params.id)}, payload.dispatch, {
          accessToken: payload.accessToken,
        }).then(resolve);
      });
    },
    title: 'Edit task | Instantboard',
  },
}, {
  key: StoryboardKeys.LabelStoryboard,
  component: LabelStoryboard,
  path: '/labels/new',
  options: {
    initialize: (params: any, args: any, payload: any) => {
      return new Promise((resolve) => {
        fetchInitialData({selectedTaskId: null, selectedLabelId: null}, payload.dispatch, {
          accessToken: payload.accessToken,
        }).then(resolve);
      });
    },
    title: 'New label | Instantboard',
  },
}, {
  key: StoryboardKeys.LabelStoryboard,
  component: LabelStoryboard,
  path: '/labels/:id/edit',
  options: {
    initialize: (params: any, args: any, payload: any) => {
      return new Promise((resolve) => {
        fetchInitialData({selectedLabelId: Number(params.id)}, payload.dispatch, {
          accessToken: payload.accessToken,
        }).then(resolve);
      });
    },
    title: 'Edit label | Instantboard',
  },
}, {
  key: StoryboardKeys.MemberStoryboard,
  component: MemberStoryboard,
  path: '/labels/:id/members',
  options: {
    initialize: (params: any, args: any, payload: any) => {
      return new Promise((resolve) => {
        fetchInitialData({selectedLabelId: Number(params.id)}, payload.dispatch, {
          accessToken: payload.accessToken,
        }).then(resolve);
      });
    },
    title: 'Member | Instantboard',
  },
}];
