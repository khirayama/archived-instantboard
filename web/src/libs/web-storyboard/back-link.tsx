import * as PropTypes from 'prop-types';
import * as React from 'react';

import {isBrowser} from './utils';

export class BackLink extends React.Component<any, any> {
  public static propTypes = {
    children: PropTypes.node.isRequired,
  };

  public static contextTypes = {
    move: PropTypes.func,
    isPush: PropTypes.func,
    calcBackPath: PropTypes.func,
  };

  public context: any;

  public render() {
    const path = this.context.calcBackPath();
    return <a href={path} onClick={(event) => this.handleClick(event)}>{this.props.children}</a>;
  }

  private handleClick(event: any) {
    if (isBrowser() && window.history && !event.metaKey) {
      event.preventDefault();
      const path = this.context.calcBackPath();
      this.context.move(path);
    }
  }
}
