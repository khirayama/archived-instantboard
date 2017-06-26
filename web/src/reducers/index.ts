const reducer = (state: IState, action: IAction) => {
  const newState: IState = Object.assign({}, state);

  if (action) {
    switch (action.type) {
      case '__FETCH_INITIAL_DATA': {
        newState.isAuthenticated = action.isAuthenticated;
        newState.user = action.user;
        newState.tasks = action.tasks;
        break;
      }
      case '__FAILURE_FETCH_INITIAL_DATA': {
        newState.isAuthenticated = action.isAuthenticated;
        newState.user = null;
        newState.tasks = [];
        break;
      }
      case '__CREATE_TOKEN': {
        newState.isAuthenticated = action.isAuthenticated;
        newState.user = action.user;

        newState.tasks = newState.tasks;
        break;
      }
      case '__UPDATE_USER': {
        newState.user = Object.assign({}, state.user, action.user);

        newState.isAuthenticated = newState.isAuthenticated;
        newState.tasks = newState.tasks;
        break;
      }
      case '__FAILURE_UPDATE_USER': {
        newState.user = action.user;

        newState.isAuthenticated = newState.isAuthenticated;
        newState.tasks = newState.tasks;
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
