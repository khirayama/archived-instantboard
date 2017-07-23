import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

export class RequestsTabContent extends React.Component<any, any> {
  render() {
    const requests = this.props.requests;
    const actions = this.props.actions;

    return (
      <ul>
        {this.props.requests.map((request: any) => {
          return (
            <li key={request.id}>
              <strong>{request.labelName}</strong>
              From {request.memberName}
              <div>
                <div onClick={() => {actions.acceptRequest(request.id)}}>Accept</div>
                <div onClick={() => {actions.refuseRequest(request.id)}}>Refuse</div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
