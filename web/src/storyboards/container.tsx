import * as PropTypes from 'prop-types';
import * as React from 'react';

import {extractAccessToken} from '../utils';
import {fetchInitialData} from '../action-creators';

function isBrowser() {
  return typeof window === 'object';
}

interface IStore {
  dispatch: any;
  getState: any;
  addChangeListener: any;
}

interface IContainerProps {
  initialize: any;
  store: IStore;
}

interface IContainerState {
  initializing: boolean;
}

export default class Container<IContainerProps, IContainerState> extends React.Component<any, any> {
  protected accessToken: any;

  private updateState: any;

  private static pollingTimerId: any;

  constructor(props: any) {
    super(props);

    this.state = Object.assign({
      initializing: false,
    }, props.store.getState());

    this.updateState = this._updateState.bind(this);
  }

  public componentWillMount() {
    if (isBrowser()) {
      this.setState({initializing: true});
      this.accessToken = extractAccessToken();
      this.props.initialize(window.location.pathname, {
        accessToken: this.accessToken,
        dispatch: this.props.store.dispatch.bind(this.props.store),
      }).then((result: any) => {
        if (result.title) {
          window.document.title = result.title;
        }
        this.setState({initializing: false});
      });
    }
    const store = this.props.store;
    store.addChangeListener(this.updateState);

    if (isBrowser() && !Container.pollingTimerId) {
      Container.pollingTimerId = setInterval(() => {
        fetchInitialData(
          {},
          this.props.store.dispatch.bind(this.props.store),
          {accessToken: this.accessToken}
        );
      }, 1000 * 5);
    }
  }
  public componentWillUnmount() {
    const store = this.props.store;

    store.removeChangeListener(this.updateState);
  }
  private _updateState() {
    const store = this.props.store;

    this.setState(store.getState());
  }
}
