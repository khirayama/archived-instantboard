import * as PropTypes from 'prop-types';
import * as React from 'react';

import {updateUser} from '../../action-creators';
import Container from '../container';

export default class NewUserStoryboard extends Container<any, any> {
  public static propTypes = {};

  public static contextTypes = {
    move: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = Object.assign(this.state, {
      username: this.state.user.username || 'khirayama',
    });
  }

  public handleChangeUsername(event: any) {
    this.setState({
      username: event.currentTarget.value,
    });
  }

  public handleClickRegisterButton() {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    updateUser(dispatch, {
      username: this.state.username,
    }, {accessToken: this.accessToken}).then(() => {
      this.context.move('/');
    });
  }

  public render() {
    return (
      <section className="storyboard">
        <h1>NewUserStoryboard</h1>
        <input
          type="text"
          value={this.state.username}
          onChange={(event) => {this.handleChangeUsername(event); }}
          placeholder="Username"
        />
        <p>{(this.state.user.errors.length) ? this.state.user.errors.join(', ') : null}</p>
        <div onClick={() => {this.handleClickRegisterButton(); }}>Start!</div>
      </section>
    );
  }
}
