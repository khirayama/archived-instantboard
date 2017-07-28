import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import {
  SwipeableView,
  SwipeableViewBackground,
  SwipeableViewContent,
} from '../../components/swipeable-view';

import {
  List,
  ListItem,
} from '../../components/list';

import {Icon} from '../../components/icon';

export class LabelsTabContent extends React.Component<any, any> {
  public static contextTypes = {
    move: PropTypes.func,
  };

  public render() {
    const labels = this.props.labels;
    const actions = this.props.actions;
    return (labels.length) ? (
      <List
        className="label-list"
        onSort={(from: number, to: number) => {
          const label = labels[from];
          actions.sortLabel(label.id, to);
        }}
      >
        {labels.map((label: any) => {
          return (
            <ListItem key={label.id}>
              <SwipeableView
                onSwipeLeft={() => {actions.deleteLabel(label.id); }}
                onSwipeRight={() => {actions.updateLabel(label.id, {visibled: !label.visibled}); }}
                throughLeft={true}
                >
                <SwipeableViewBackground position="left">
                  {(label.visibled) ?
                    (<Icon>visibility_off</Icon>) :
                    (<Icon>visibility</Icon>)
                  }
                </SwipeableViewBackground>
                <SwipeableViewContent
                  onClick={() => this.context.move(`/labels/${label.id}/edit`)}
                  className={classNames('label-list-item', {'label-list-item__unvisibled': !label.visibled})}
                  >
                  <div>{label.name}</div>
                </SwipeableViewContent>
                <SwipeableViewBackground position="right">
                  <Icon>delete</Icon>
                </SwipeableViewBackground>
              </SwipeableView>
            </ListItem>
          );
        })}
      </List>
    ) : (
      <div className="no-label-content">
        <p>No labels</p>
      </div>
    );
  }
}
