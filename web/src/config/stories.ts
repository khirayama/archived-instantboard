// [LoginStoryboard]-----(show)---[NewUserStoryboard]---(temporary)---[MainStoryboard]---(temporary)---[TaskStoryboard]
//                    |                                                    |      |
//                    ----------------------(temporary)---------------------      |---(temporary)---[LabelStoryboard]

import {segueTypes} from '../libs/web-storyboard/constants';

import LoginStoryboard from '../storyboards/login-storyboard';
import NewUserStoryboard from '../storyboards/new-user-storyboard';
import MainStoryboard from '../storyboards/main-storyboard';
import TaskStoryboard from '../storyboards/task-storyboard';
import LabelStoryboard from '../storyboards/label-storyboard';

import {
  initializeMainStoryboard,
  initializeNewUserStoryboard,
} from '../action-creators';

const StoryboardKeys = {
  LoginStoryboard: 'Login Storyboard',
  NewUserStoryboard: 'New User Storyboard',
  MainStoryboard: 'Main Storyboard',
  TaskStoryboard: 'Task Storyboard',
  LabelStoryboard: 'Label Storyboard',
};

const segues = [{
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
}];

const storyboards = [{
  key: StoryboardKeys.LoginStoryboard,
  component: LoginStoryboard,
  path: '/login',
  options: {
    args: null,
    initialize: null,
    title: 'Login | Instantboard',
  },
}, {
  key: StoryboardKeys.NewUserStoryboard,
  component: NewUserStoryboard,
  path: '/users/new',
  options: {
    args: null,
    initialize: initializeNewUserStoryboard,
    title: 'Register | Instantboard',
  },
}, {
  root: true,
  key: StoryboardKeys.MainStoryboard,
  component: MainStoryboard,
  path: '/',
  options: {
    args: null,
    initialize: initializeMainStoryboard,
    title: 'Instantboard',
  },
}, {
  key: StoryboardKeys.TaskStoryboard,
  component: TaskStoryboard,
  path: '/tasks/new',
  options: {
    args: null,
    initialize: initializeMainStoryboard,
    title: 'New task | Instantboard',
  },
}, {
  key: StoryboardKeys.TaskStoryboard,
  component: TaskStoryboard,
  path: '/tasks/:id/edit',
  options: {
    args: null,
    initialize: initializeMainStoryboard,
    title: 'Edit task | Instantboard',
  },
}, {
  key: StoryboardKeys.LabelStoryboard,
  component: LabelStoryboard,
  path: '/labels/new',
  options: {
    args: null,
    initialize: initializeMainStoryboard,
    title: 'New label | Instantboard',
  },
}, {
  key: StoryboardKeys.LabelStoryboard,
  component: LabelStoryboard,
  path: '/labels/:id/edit',
  options: {
    args: null,
    initialize: initializeMainStoryboard,
    title: 'Edit label | Instantboard',
  },
}];

export {
  segues,
  storyboards,
};
