import * as PropTypes from 'prop-types';
import * as React from 'react';

import {isBrowser} from './utils';

export class Link extends React.Component<any, any> {
  public static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  public static contextTypes = {
    move: PropTypes.func,
  };

  public render() {
    return <a href={this.props.href} onClick={(event) => this.handleClick(event)}>{this.props.children}</a>;
  }

  private handleClick(event: any) {
    if (isBrowser() && window.history && !event.metaKey) {
      event.preventDefault();
      const path = this.props.href;
      this.context.move(path);
    }
  }
}
