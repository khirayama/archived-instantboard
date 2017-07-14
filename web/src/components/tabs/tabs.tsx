import * as PropTypes from 'prop-types';
import * as React from 'react';

export class Tabs extends React.Component<any, any> {
  private static childContextTypes = {
    currentIndex: PropTypes.number,
    setCurrentIndex: PropTypes.func,
  }

  private static propTypes = {
    index: PropTypes.number,
    children: PropTypes.node,
  }

  constructor(props: any) {
    super(props);

    this.state = {
      currentIndex: props.index || 0,
    };
  }
  _setCurrentIndex(index: number) {
    this.setState({currentIndex: index});
  }
  getChildContext() {
    return {
      currentIndex: this.state.currentIndex,
      setCurrentIndex: this._setCurrentIndex.bind(this),
    };
  }
  render() {
    return (
      <section
        className="tabs"
        >{this.props.children}</section>
    );
  }
}
