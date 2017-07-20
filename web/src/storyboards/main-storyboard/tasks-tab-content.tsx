import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as classNames from 'classnames';

import {
  RecycleTable,
  RecycleTableList,
  RecycleTableListItem,
  RecycleTableContentList,
  RecycleTableContentListItem,
} from '../../components/recycle-table';

import {
  SwipeableView,
  SwipeableViewContent,
  SwipeableViewBackground,
} from '../../components/swipeable-view';

import {
  List,
  ListItem,
} from '../../components/list';

export class TasksTabContent extends React.Component<any, any> {
  public render() {
    const tasks = this.props.tasks;
    const labels = this.props.labels;
    const actions = this.props.actions;
    return (
      <RecycleTable>
        <RecycleTableList>
          {labels.map((label: any, index: number) => {
            return <RecycleTableListItem key={label.id} index={index}>{label.name}</RecycleTableListItem>
          })}
        </RecycleTableList>

        <RecycleTableContentList>
          {labels.map((label: any, index: number) => {
            const groupedTasks = tasks.filter((task: any) => {
              return (task.labelId === label.id);
            });
            return (
              <RecycleTableContentListItem key={index}>
                <List
                  onSort={(from: number, to: number) => {
                    const task = groupedTasks[from];
                    actions.sortTask(task.id, to);
                  }}
                >
                  {groupedTasks.map((task: any) => {
                    return (
                      <ListItem key={task.id}>
                        <SwipeableView
                          onSwipeLeft={() => {actions.deleteTask(task.id)}}
                          onSwipeRight={() => {actions.updateTask(task.id, {completed: !task.completed})}}
                          throughLeft={true}
                          >
                          <SwipeableViewBackground position='left'><span>L</span></SwipeableViewBackground>
                          <SwipeableViewContent>
                            <div className={classNames("task-list-item", {"task-list-item__completed": task.completed})}>{task.content}</div>
                          </SwipeableViewContent>
                          <SwipeableViewBackground position='right'><span>R</span></SwipeableViewBackground>
                        </SwipeableView>
                      </ListItem>
                    );
                  })}
                </List>
              </RecycleTableContentListItem>
            );
          })}
        </RecycleTableContentList>
      </RecycleTable>
    );
  }
}
