import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as classNames from 'classnames';

import {
  updateUser,
  validUser,
} from '../../action-creators';
import Container from '../container';

export default class NewUserStoryboard extends Container<any, any> {
  public static propTypes = {};

  public static contextTypes = {
    move: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = Object.assign(this.state, {
      username: (this.state.user) ? this.state.user.username : '',
    });
  }

  public handleChangeUsername(event: any) {
    this.setState({
      username: event.currentTarget.value,
    });

    const dispatch = this.props.store.dispatch.bind(this.props.store);
    const username = event.currentTarget.value.trim();
    validUser(dispatch, {username}, {accessToken: this.accessToken});
  }

  public handleClickRegisterButton() {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    const username = this.state.username.trim();

    if (username) {
      updateUser(dispatch, {username}, {accessToken: this.accessToken}).then(() => {
        this.context.move('/');
      });
    }
  }

  public render() {
    const errors = (this.state.user) ? this.state.user.errors || [] : [];

    return (
      <section className="new-user-storyboard storyboard">
        <section className="new-user-storyboard--content">
          <p>
            Please put your screen name.<br/>
            Get it used with share your tasks.
          </p>
          <input
            type="text"
            autoFocus
            value={this.state.username}
            onChange={(event) => {this.handleChangeUsername(event); }}
            placeholder="My screen name"
          />
          <p className="error-messages">{errors.join(', ')}</p>
          <div className={classNames("start-app-button", {"start-app-button__disabled": !this.state.username.trim() || errors.length})} onClick={() => {this.handleClickRegisterButton(); }}>Start app</div>
        </section>
      </section>
    );
  }
}
