import * as PropTypes from 'prop-types';
import * as React from 'react';

export class SwipeableView extends React.Component<any, any> {
  private static childContextTypes = {
    swipeableViewElement: PropTypes.func,
    getProps: PropTypes.func,
  };

  private static propTypes = {
    children: PropTypes.node,
  };

  private swipeableViewElement: any;

  getChildContext() {
    return {
      swipeableViewElement: () => this.swipeableViewElement,
      getProps: () => this.props,
    };
  }
  _setSwipeableViewElement(swipeableViewElement: any) {
    this.swipeableViewElement = swipeableViewElement;
  }
  render() {
    return (
      <div
        className="swipeable-view"
        ref={(el: any) => this._setSwipeableViewElement(el)}
        >{this.props.children}</div>
    );
  }
}
