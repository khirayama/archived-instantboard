import * as PropTypes from 'prop-types';
import * as React from 'react';

export class RecycleTable extends React.Component<any, any> {
  private static childContextTypes = {
    currentIndex: PropTypes.number,
    setCurrentIndex: PropTypes.func,
  }

  private static propTypes = {
    index: PropTypes.number,
    children: PropTypes.node,
  }

  private el: any;

  constructor(props: any) {
    super(props);

    this.state = {
      currentIndex: props.index || 0,
    };
  }

  getChildContext() {
    return {
      currentIndex: this.state.currentIndex,
      setCurrentIndex: this._setCurrentIndex.bind(this),
    };
  }

  _scrollToCenter(index: any) {
    let timerId: any = null;
    timerId = setInterval(() => {
      const el = this.el;
      const list = el.querySelector('.recycle-table-list');
      const listItems = list.querySelectorAll('.recycle-table-list-item');
      const listItem = listItems[index];
      const currentScrollLeft = list.scrollLeft;
      const scrollLeft = listItem.offsetLeft - (el.clientWidth - listItem.clientWidth) / 2;

      const speed = (scrollLeft - currentScrollLeft) / 8;
      list.scrollLeft += speed;
      if (Math.abs(speed) < 1) {
        clearInterval(timerId);
      }
    }, 1000/60);
  }

  _setCurrentIndex(index: number) {
    this.setState({currentIndex: index});
    this._scrollToCenter(index);
  }

  render() {
    return (
      <section
        className="recycle-table"
        ref={(el: any) => this.el = el}
        >{this.props.children}</section>
    );
  }
}