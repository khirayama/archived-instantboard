// [Main Storyboard]-----(show)---[Post Index Storyboard]---(show)---[Post Show Storyboard]
//                    |
//                    ---(temporary)---[Profile Storyboard]

import {segueTypes} from '../libs/web-storyboard/constants';

import LoginStoryboard from '../storyboards/login-storyboard';
import MainStoryboard from '../storyboards/main-storyboard';
import ProfileStoryboard from '../storyboards/profile-storyboard';

import {
  initializeMainStoryboard,
  initializeProfileStoryboard,
} from '../action-creators';

const StoryboardKeys = {
  MainStoryboard: 'Main Storyboard',
  LoginStoryboard: 'Login Storyboard',
  ProfileStoryboard: 'Profile Storyboard',
};

const segues = [{
  from: StoryboardKeys.LoginStoryboard,
  to: StoryboardKeys.MainStoryboard,
  type: segueTypes.show,
}, {
  from: StoryboardKeys.MainStoryboard,
  to: StoryboardKeys.ProfileStoryboard,
  type: segueTypes.temporary,
}];

const storyboards = [{
  key: StoryboardKeys.LoginStoryboard,
  component: LoginStoryboard,
  path: '/login',
  options: {
    args: null,
    initialize: null,
    title: 'Instantboard',
  },
}, {
  root: true,
  key: StoryboardKeys.MainStoryboard,
  component: MainStoryboard,
  path: '/',
  options: {
    args: null,
    initialize: initializeMainStoryboard,
    title: 'Main',
  },
}, {
  key: StoryboardKeys.ProfileStoryboard,
  component: ProfileStoryboard,
  path: '/profile',
  options: {
    args: null,
    initialize: initializeProfileStoryboard,
    title: 'Profile',
  },
}];

export {
  segues,
  storyboards,
};
