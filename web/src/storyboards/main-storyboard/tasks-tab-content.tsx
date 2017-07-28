import * as classNames from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import {
  RecycleTable,
  RecycleTableContentList,
  RecycleTableContentListItem,
  RecycleTableList,
  RecycleTableListItem,
} from '../../components/recycle-table';

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
import {LinkText} from '../../components/link-text';

export class TasksTabContent extends React.Component<any, any> {
  public static contextTypes = {
    move: PropTypes.func,
  };

  public render() {
    const tasks = this.props.tasks;
    const labels = this.props.labels.filter((label: any) => label.visibled);
    const actions = this.props.actions;
    return (
      <RecycleTable>
        <RecycleTableList>
          {labels.map((label: any, index: number) => {
            return <RecycleTableListItem key={label.id} index={index}>{label.name}</RecycleTableListItem>;
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
                  className="task-list"
                  onSort={(from: number, to: number) => {
                    const task = groupedTasks[from];
                    actions.sortTask(task.id, to);
                  }}
                >
                  {groupedTasks.map((task: any) => {
                    return (
                      <ListItem key={task.id}>
                        <SwipeableView
                          onSwipeLeft={() => {actions.deleteTask(task.id); }}
                          onSwipeRight={() => {actions.updateTask(task.id, {completed: !task.completed}); }}
                          throughLeft={true}
                          >
                          <SwipeableViewBackground position="left">
                            <Icon>check</Icon>
                          </SwipeableViewBackground>
                          <SwipeableViewContent
                            onClick={() => this.context.move(`/tasks/${task.id}/edit`)}
                            className={classNames('task-list-item', {'task-list-item__completed': task.completed})}
                            >
                            {(task.schedule) ? (
                              <span className="task-list-item-content-schedule-container">
                                <span className={`task-list-item-content-schedule task-list-item-content-schedule__${task.schedule.shortMonthName.toLowerCase()}`}>
                                  <span className="task-list-item-content-schedule-month">
                                    {task.schedule.shortMonthName}
                                  </span>
                                  <span className="task-list-item-content-schedule-date">
                                    {task.schedule.date}
                                  </span>
                                  <span className="task-list-item-content-schedule-day">
                                    {task.schedule.shortDayName}
                                  </span>
                                </span>
                              </span>
                            ) : null}
                            <span className="task-list-item-content-text"><LinkText>{task.text}</LinkText></span>
                          </SwipeableViewContent>
                          <SwipeableViewBackground position="right">
                            <Icon>delete</Icon>
                          </SwipeableViewBackground>
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
