const reducer = (state: IState, action: any) => {
  const newState: IState = Object.assign({}, state);

  if (action) {
    switch (action.type) {
      case '__FETCH_INITIAL_DATA': {
        newState.isAuthenticated = action.isAuthenticated;
        newState.user = action.user;
        newState.tasks = action.tasks;
        newState.labels = action.labels;
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
        break;
      }
      case '__UPDATE_USER': {
        newState.user = Object.assign({}, state.user, action.user);
        break;
      }
      case '__FAILURE_UPDATE_USER': {
        newState.user = action.user;
        break;
      }
      // Labels
      case '__CREATE_LABEL': {
        newState.labels.push(action.label);
        break;
      }
      case '__DELETE_LABEL': {
        newState.labels = state.labels.filter(label => {
          return (label.id !== action.labelId);
        });
        break;
      }
      case '__SORT_LABEL': {
        newState.labels = action.labels;
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
