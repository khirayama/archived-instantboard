const reducer = (state: IState, action: any) => {
  const newState: IState = Object.assign({}, state);

  if (action) {
    switch (action.type) {
      case '__FETCH_INITIAL_DATA': {
        newState.isAuthenticated = action.isAuthenticated;
        newState.user = action.user;
        newState.tasks = action.tasks;
        newState.labels = action.labels;
        newState.requests = action.requests;
        break;
      }
      case '__FAILURE_FETCH_INITIAL_DATA': {
        newState.isAuthenticated = action.isAuthenticated;
        newState.user = null;
        newState.tasks = [];
        newState.labels = [];
        newState.requests = [];
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
      // Tasks
      case '__CREATE_TASK': {
        newState.tasks.push(action.task);
        break;
      }
      case '__UPDATE_TASK': {
        newState.tasks = state.tasks.map((task) => {
          if (task.id === action.task.id) {
            return action.task;
          }
          return task;
        });
        break;
      }
      case '__DELETE_TASK': {
        newState.tasks = state.tasks.filter((task) => {
          return (task.id !== action.taskId);
        });
        break;
      }
      case '__SORT_TASK': {
        newState.tasks = action.tasks;
        break;
      }
      // Labels
      case '__CREATE_LABEL': {
        newState.labels.push(action.label);
        break;
      }
      case '__UPDATE_LABEL': {
        newState.labels = state.labels.map((label) => {
          if (label.id === action.label.id) {
            return action.label;
          }
          return label;
        });
        break;
      }
      case '__DELETE_LABEL': {
        newState.labels = state.labels.filter((label) => {
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
