import * as PropTypes from 'prop-types';
import * as React from 'react';

export class TabList extends React.Component<any, any> {
  private static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <section className="tab-list">
        <section className="tab-list-inner">
          {this.props.children}
        </section>
      </section>
    );
  }
}
