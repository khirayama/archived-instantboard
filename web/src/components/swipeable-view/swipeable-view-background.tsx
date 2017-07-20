import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as classNames from 'classnames';

export class SwipeableViewBackground extends React.Component<any, any> {
  private static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    position: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div
        className={
          classNames(
            this.props.className,
            'swipeable-view-background',
            {'swipeable-view-background__left': this.props.position === 'left'},
            {'swipeable-view-background__right': this.props.position === 'right'}
          )
        }
        >{this.props.children}</div>
    );
  }
}
