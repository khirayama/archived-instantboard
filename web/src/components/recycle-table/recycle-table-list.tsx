import * as PropTypes from 'prop-types';
import * as React from 'react';

export class RecycleTableList extends React.Component<any, any> {
  private static propTypes = {
    children: PropTypes.node,
  };

  private recycleTableList: any;

  componentDidMount() {
    this._adjustListPosition();
  }

  componentDidUpdate() {
    this._adjustListPosition();
  }

  _adjustListPosition() {
    const el = this.recycleTableList;
    const container = el.parentNode;
    const inner = el.querySelector('.recycle-table-list--inner');
    const listItems = el.querySelectorAll('.recycle-table-list-item');
    const firstItem = listItems[0];
    const lastItem = listItems[listItems.length - 1];
    if (container && firstItem && lastItem) {
      const paddingLeft = (container.clientWidth - firstItem.clientWidth) / 2;
      const paddingRight = (container.clientWidth - lastItem.clientWidth) / 2;
      let width: number = 0;
      for (let i = 0; i < listItems.length; i++) {
        width += listItems[i].clientWidth;
      }

      inner.style.width = (width + paddingLeft + paddingRight + 1) + 'px';
      inner.style.paddingLeft = paddingLeft + 'px';
      inner.style.paddingRight = paddingRight + 'px';
    }
  }

  _setRecycleTableList(recycleTableList: HTMLElement|null) {
    this.recycleTableList = recycleTableList;
  }

  render() {
    return (
      <section
        className="recycle-table-list"
        ref={(el) => this._setRecycleTableList(el)}
        >
        <section className="recycle-table-list--inner">
          {this.props.children}
        </section>
      </section>
    );
  }
}
