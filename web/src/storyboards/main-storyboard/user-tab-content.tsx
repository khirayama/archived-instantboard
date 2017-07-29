import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import {Icon} from '../../components/icon';

export class UserTabContent extends React.Component<any, any> {
  public static contextTypes = {
    move: PropTypes.func,
  };

  public render() {
    const user = this.props.user;
    const actions = this.props.actions;
    return (
      <section>
        <div>
          <Icon>person</Icon>
          <div>
            <input
              value={user.username}
              onBlur={(event: any) => {
                actions.updateUser(this.state.username.trim());
              }}
            />
            <Icon>edit</Icon>
          </div>
        </div>
        <div onClick={() => actions.logout()}>Logout</div>
        <div onClick={() => actions.deleteUser()}>Delete account</div>
      </section>
    );
  }
}
