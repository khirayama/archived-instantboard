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
          {user.username}
          <Icon>edit</Icon>
        </div>
      </section>
    );
  }
}
