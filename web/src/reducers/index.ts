const reducer = (state: any, action: any) => {
  const newState = Object.assign({}, state);
  if (action) {
    switch (action.type) {
      case '__INITIALIZE_MAIN_STORYBOARD': {
        newState.isAuthenticated = action.isAuthenticated;
        newState.user = action.user;
        break;
      }
      case '__INITIALIZE_NEW_USER_STORYBOARD': {
        newState.isAuthenticated = action.isAuthenticated;
        newState.user = action.user;
        break;
      }
      case '__CREATE_TOKEN': {
        newState.isAuthenticated = action.isAuthenticated;
        newState.user = action.user;
        break;
      }
      case '__UPDATE_USER': {
        newState.user = Object.assign({}, state.user, action.user);
        break;
      }
      case '__FAILURE_UPDATE_USER': {
        newState.user.errors.push(action.error);
        break;
      }
      default: {
        break;
      }
    }
  }
  return newState;
};

export default reducer;
