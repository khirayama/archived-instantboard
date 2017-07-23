import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import {
  THRESHOLD_DELTA,
  TRANSITION_TIME,
  transitionProperties,
} from '../constants';

export class SwipeableViewContent extends React.Component<any, any> {
  private static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  private static contextTypes = {
    swipeableViewElement: PropTypes.func,
    getProps: PropTypes.func,
  };

  private touch: any;
  private swipeableViewContentElement: any;

  constructor() {
    super();

    this.touch = {
      startX: null,
      startY: null,
      startTime: new Date(),
      endX: null,
      endY: null,
      endTime: new Date(),
    };
  }
  _handleTouchStart(event: any) {
    this.touch = Object.assign({}, this.touch, {
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY,
      startTime: new Date(),
    });
  }
  _handleTouchMove(event: any) {
    event.stopPropagation();

    if (this.touch.startX === null || this.touch.startY === null) {
      return;
    }

    const distance = Math.sqrt(
      Math.pow(event.touches[0].clientX - this.touch.startX, 2) +
      Math.pow(event.touches[0].clientY - this.touch.startY, 2),
    );

    if (distance > 10) {
      this.touch = Object.assign({}, this.touch, {
        endX: event.touches[0].clientX,
        endY: event.touches[0].clientY,
        endTime: new Date(),
      });

      this._updateTouchMoveView();
    }
  }
  _handleTouchEnd() {
    if (this.touch.startX === null || this.touch.startY === null) {
      return;
    }

    this._updateTouchEndView();

    const props = this.context.getProps();

    if (this._isRightSwipe()) {
      setTimeout(() => {
        if (props.onSwipeRight) {
          props.onSwipeRight();
        }
      }, TRANSITION_TIME);
    } else if (this._isLeftSwipe()) {
      setTimeout(() => {
        if (props.onSwipeLeft) {
          props.onSwipeLeft();
        }
      }, TRANSITION_TIME);
    }

    this.touch = {
      startX: null,
      startY: null,
      startTime: new Date(),
      endX: null,
      endY: null,
      endTime: new Date(),
    };
  }
  _updateTouchMoveView() {
    this._updateSwipeableViewContentView();
    this._updateBackgroundView();
  }
  _updateTouchEndView() {
    const props = this.context.getProps();
    const swipeableViewElement = this.context.swipeableViewElement();
    const leftBackgroundElement = swipeableViewElement.querySelector('.swipeable-view-background__left');
    const rightBackgroundElement = swipeableViewElement.querySelector('.swipeable-view-background__right');

    this.swipeableViewContentElement.style.transitionProperty = transitionProperties.TRANSFORM;

    if (this._isRightSwipe() && props.throughRight === true) {
      this.swipeableViewContentElement.style.transform = `translateX(100%)`;
    } else if (this._isLeftSwipe() && props.throughLeft === true) {
      this.swipeableViewContentElement.style.transform = `translateX(-100%)`;
    } else {
      this.swipeableViewContentElement.style.transform = `translateX(0px)`;
    }
    if (swipeableViewElement.classList.contains('swipeable-view__moving')) {
      setTimeout(() => {
        swipeableViewElement.classList.remove('swipeable-view__moving');
        this.swipeableViewContentElement.classList.remove('swipeable-view-content__swipe');
        this.swipeableViewContentElement.classList.remove('swipeable-view-content__swipe_left');
        this.swipeableViewContentElement.classList.remove('swipeable-view-content__swipe_right');
        if (leftBackgroundElement) {
          leftBackgroundElement.classList.remove('swipeable-view-background__will-swipe');
        }
        if (rightBackgroundElement) {
          rightBackgroundElement.classList.remove('swipeable-view-background__will-swipe');
        }
        // Prevent flickering of animation
      }, TRANSITION_TIME + 1);
    }
  }
  _isLeftSwipe() {
    const diff = this._calcDiff();
    const THRESHOLD_WIDTH = window.innerWidth / 4;

    return (
      (Math.abs(diff.x) > THRESHOLD_WIDTH && diff.x < 0) ||
      (Math.abs(diff.delta.x) > THRESHOLD_DELTA && diff.x < 0)
    );
  }
  _isRightSwipe() {
    const diff = this._calcDiff();
    const THRESHOLD_WIDTH = window.innerWidth / 4;

    return (
      (Math.abs(diff.x) > THRESHOLD_WIDTH && diff.x > 0) ||
      (Math.abs(diff.delta.x) > THRESHOLD_DELTA && diff.delta.x > 0)
    );
  }
  _calcDiff() {
    let x = this.touch.endX - this.touch.startX;
    let y = this.touch.endY - this.touch.startY;
    let time = this.touch.endTime.getTime() - this.touch.startTime.getTime();

    time = (time < 0) ? 0 : time;

    if (this.touch.endX === null || this.touch.endY === null) {
      x = 0;
      y = 0;
    }
    return {
      x,
      y,
      time,
      delta: {
        x: Number((x / time).toFixed(2)),
        y: Number((y / time).toFixed(2)),
      },
    };
  }
  _updateSwipeableViewContentView() {
    const diff = this._calcDiff();
    const props = this.context.getProps();
    const swipeableViewElement = this.context.swipeableViewElement();

    if (Math.abs(diff.x) > Math.abs(diff.y)) {
      let diffX = diff.x;
      if (diff.x < 0 && !props.onSwipeLeft) {
        diffX = 0;
      }
      if (diff.x > 0 && !props.onSwipeRight) {
        diffX = 0;
      }
      swipeableViewElement.classList.add('swipeable-view__moving');
      this.swipeableViewContentElement.style.transitionProperty = transitionProperties.NONE;
      this.swipeableViewContentElement.style.transform = `translateX(${diffX}px)`;
    }
    if (this._isLeftSwipe()) {
      this.swipeableViewContentElement.classList.add('swipeable-view-content__swipe');
      this.swipeableViewContentElement.classList.add('swipeable-view-content__swipe_left');
    } else if (this._isRightSwipe()) {
      this.swipeableViewContentElement.classList.add('swipeable-view-content__swipe');
      this.swipeableViewContentElement.classList.add('swipeable-view-content__swipe_right');
    } else {
      this.swipeableViewContentElement.classList.remove('swipeable-view-content__swipe');
      this.swipeableViewContentElement.classList.remove('swipeable-view-content__swipe_left');
      this.swipeableViewContentElement.classList.remove('swipeable-view-content__swipe_right');
    }
  }
  _updateBackgroundView() {
    const diff = this._calcDiff();
    const swipeableViewElement = this.context.swipeableViewElement();
    const leftBackgroundElement = swipeableViewElement.querySelector('.swipeable-view-background__left');
    const rightBackgroundElement = swipeableViewElement.querySelector('.swipeable-view-background__right');

    if (diff.x > 1 && Math.abs(diff.x) > Math.abs(diff.y)) {
      if (leftBackgroundElement) {
        leftBackgroundElement.style.display = 'inline-block';
      }
      if (rightBackgroundElement) {
        rightBackgroundElement.style.display = 'none';
      }
    } else if (diff.x < 0 && Math.abs(diff.x) > Math.abs(diff.y)) {
      if (leftBackgroundElement) {
        leftBackgroundElement.style.display = 'none';
      }
      if (rightBackgroundElement) {
        rightBackgroundElement.style.display = 'inline-block';
      }
    }

    if (this._isRightSwipe()) {
      if (leftBackgroundElement) {
        if (!leftBackgroundElement.classList.contains('swipeable-view-background__will-swipe')) {
          leftBackgroundElement.classList.add('swipeable-view-background__will-swipe');
        }
      }
    } else if (this._isLeftSwipe()) {
      if (rightBackgroundElement) {
        if (!rightBackgroundElement.classList.contains('swipeable-view-background__will-swipe')) {
          rightBackgroundElement.classList.add('swipeable-view-background__will-swipe');
        }
      }
    } else {
      if (leftBackgroundElement) {
        if (leftBackgroundElement.classList.contains('swipeable-view-background__will-swipe')) {
          leftBackgroundElement.classList.remove('swipeable-view-background__will-swipe');
        }
      }
      if (rightBackgroundElement) {
        if (rightBackgroundElement.classList.contains('swipeable-view-background__will-swipe')) {
          rightBackgroundElement.classList.remove('swipeable-view-background__will-swipe');
        }
      }
    }
  }
  _setSwipeableViewContent(swipeableViewContentElement: any) {
    this.swipeableViewContentElement = swipeableViewContentElement;
  }
  render() {
    return (
      <div
        {...this.props}
        className={classNames(this.props.className, 'swipeable-view-content')}
        ref={(el: any) => this._setSwipeableViewContent(el)}
        onTouchStart={(event: any) => this._handleTouchStart(event)}
        onTouchMove={(event: any) => this._handleTouchMove(event)}
        onTouchEnd={() => this._handleTouchEnd()}
        >{this.props.children}</div>
    );
  }
}
