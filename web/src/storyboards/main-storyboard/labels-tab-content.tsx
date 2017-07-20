import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as classNames from 'classnames';

import {
  SwipeableView,
  SwipeableViewContent,
  SwipeableViewBackground,
} from '../../components/swipeable-view';

import {
  List,
  ListItem,
} from '../../components/list';

export class LabelsTabContent extends React.Component<any, any> {
  public render() {
    const labels = this.props.labels;
    const actions = this.props.actions;
    return (
      <List
        onSort={(from: number, to: number) => {
          const label = labels[from];
          actions.sortLabel(label.id, to);
        }}
      >
        {labels.map((label: any) => {
          return (
            <ListItem key={label.id}>
              <SwipeableView
                onSwipeLeft={() => {actions.deleteLabel(label.id)}}
                onSwipeRight={() => {actions.updateLabel(label.id, {visibled: !label.visibled})}}
                throughLeft={true}
                >
                <SwipeableViewBackground position='left'><span>L</span></SwipeableViewBackground>
                <SwipeableViewContent>
                  <div className={classNames("label-list-item", {"label-list-item__visibled": label.completed})}>{label.name}</div>
                </SwipeableViewContent>
                <SwipeableViewBackground position='right'><span>R</span></SwipeableViewBackground>
              </SwipeableView>
            </ListItem>
          );
        })}
      </List>
    );
  }
}
