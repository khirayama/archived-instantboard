import * as PropTypes from 'prop-types';
import * as React from 'react';

import {TRANSITION_TIME} from './constants';

interface IStoryboardProps {
  initialize: any;
  component: any;
  router: any;
}

export default class Storyboard extends React.Component<IStoryboardProps, any> {
  public static propTypes = {
    router: PropTypes.shape({
      initialize: PropTypes.func.isRequired,
    }).isRequired,
    component: PropTypes.func.isRequired,
  };

  public static contextTypes = {
    isBack: PropTypes.func,
    getSegue: PropTypes.func,
  };

  public context: any;
  private storyboard: any;
  private content: any;

  public componentWillEnter(callback: any) {
    this.setTransitionEnterStyle();
    setTimeout(callback, TRANSITION_TIME);
  }
  public componentDidEnter() {
    this.resetTransitionStyle();
  }
  public componentWillLeave(callback: any) {
    this.setTransitionLeaveStyle();
    setTimeout(callback, TRANSITION_TIME);
  }
  public render() {
    const props: any = Object.assign({
      initialize: this.props.router.initialize.bind(this.props.router),
    }, this.props);
    const element = React.createElement(this.props.component, props);

    return (
      <section
        ref={(el: HTMLElement) => this.setStoryboard(el)}
        className="storyboard"
        >
        <section
          ref={(el: HTMLElement) => this.setContent(el)}
          className="storyboard-content"
          >{element}</section>
      </section>
    );
  }

  private setStoryboard(storyboard: HTMLElement): void {
    this.storyboard = storyboard;
  }
  private setContent(content: HTMLElement): void {
    this.content = content;
  }
  private setTransitionEnterStyle() {
    const style = this.storyboard.style;
    const contentStyle = this.content.style;
    style.pointerEvents = 'none';

    const isBack = this.context.isBack();
    const segue = this.context.getSegue(isBack);
    if (segue !== null) {
      switch (segue.type) {
        case 'show': {
          if (isBack) {
            style.zIndex = 1;
            contentStyle.transform = 'scale(0.9)';
            setTimeout(() => {
              contentStyle.transform = 'scale(1)';
            }, 20);
          } else {
            style.zIndex = 2;
            style.transform = 'translateX(100%)';
            setTimeout(() => {
              style.transform = 'translateX(0)';
            }, 20);
          }
          break;
        }
        case 'temporary': {
          if (isBack) {
            style.zIndex = 1;
            contentStyle.transform = 'scale(0.9)';
            setTimeout(() => {
              contentStyle.transform = 'scale(1)';
            }, 20);
          } else {
            style.zIndex = 2;
            style.transform = 'translateY(100%)';
            setTimeout(() => {
              style.transform = 'translateY(0)';
            }, 20);
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  private setTransitionLeaveStyle() {
    const style = this.storyboard.style;
    const contentStyle = this.content.style;
    style.pointerEvents = 'none';

    const isBack = this.context.isBack();
    const segue: ISegue|null = this.context.getSegue(isBack);
    if (segue !== null) {
      switch (segue.type) {
        case 'show': {
          if (isBack) {
            style.zIndex = 2;
            style.transform = 'translateX(0)';
            setTimeout(() => {
              style.transform = 'translateX(100%)';
            }, 20);
          } else {
            style.zIndex = 1;
            contentStyle.transform = 'scale(1)';
            setTimeout(() => {
              contentStyle.transform = 'scale(0.9)';
            }, 20);
          }
          break;
        }
        case 'temporary': {
          if (isBack) {
            style.zIndex = 2;
            style.transform = 'translateY(0)';
            setTimeout(() => {
              style.transform = 'translateY(100%)';
            }, 20);
          } else {
            style.zIndex = 1;
            contentStyle.transform = 'scale(1)';
            setTimeout(() => {
              contentStyle.transform = 'scale(0.9)';
            }, 20);
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  private resetTransitionStyle() {
    const style = this.storyboard.style;

    style.pointerEvents = 'auto';
    style.zIndex = 'auto';
    style.transform = 'none';
  }
}
