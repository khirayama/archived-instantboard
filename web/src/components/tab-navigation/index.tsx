import * as React from 'react';
import * as PropTypes from 'prop-types';

export class TabContent extends React.Component<any, any> {
  private static contextTypes = {
    getIndex: PropTypes.func,
    setIndex: PropTypes.func,
  };
  public render() {
    if (this.context.getIndex() === this.props.index) {
      return (
        <div>{this.props.children}</div>
      );
    }
    return null;
  }
}

export class TabContents extends React.Component<any, any> {
  private static contextTypes = {
    getIndex: PropTypes.func,
    setIndex: PropTypes.func,
  };
  public render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

export class Tab extends React.Component<any, any> {
  private static contextTypes = {
    getIndex: PropTypes.func,
    setIndex: PropTypes.func,
  };
  public render() {
    const classNames = [];
    const index = (this.props.index !== undefined) ? this.props.index : null;
    if (index === this.context.getIndex()) {
      classNames.push('__current');
    }
    return (
      <div
        className={classNames.join(' ')}
        onClick={(event: any) => this.context.setIndex(index)}
      >{this.props.children}</div>
    );
  }
}

export class Tabs extends React.Component<any, any> {
  public render() {
    return <div>{this.props.children}</div>;
  }
}

export class TabNavigation extends React.Component<any, any> {
  private static childContextTypes = {
    getIndex: PropTypes.func,
    setIndex: PropTypes.func,
  }
  private getChildContext() {
    return {
      getIndex: this.getIndex.bind(this),
      setIndex: this.setIndex.bind(this),
    };
  }
  constructor(props: any) {
    super(props);
    const initialIndex = props.initialIndex || 0;

    this.state = {
      index: initialIndex,
    };
  }
  private getIndex(index: number) {
    return this.state.index;
  }
  private setIndex(index: number|null) {
    if (index !== null && this.state.index !== index) {
      this.setState({index});
      this.props.onChange(index);
    }
  }
  public render() {
    return <div>{this.props.children}</div>;
  }
}

