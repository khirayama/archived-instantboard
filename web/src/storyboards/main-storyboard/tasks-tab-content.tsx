import * as PropTypes from 'prop-types';
import * as React from 'react';

import {
  RecycleTable,
  RecycleTableList,
  RecycleTableListItem,
  RecycleTableContentList,
  RecycleTableContentListItem,
} from '../../components/recycle-table';

const sort = {
  id: null,
  to: null,
};

class TaskListItem extends React.Component<any, any> {
  public handleClickCompleteButton() {
    const task = this.props.task;
    this.props.actions.updateTask(task.id, {completed: !task.completed});
  }

  public handleClickDeleteButton() {
    const task = this.props.task;
    this.props.actions.deleteTask(task.id);
  }

  public handleDragEnd() {
    this.props.actions.sortTask(sort.id, sort.to);
    sort.id = null;
    sort.to = null;
  }

  public render() {
    const task = this.props.task;
    return (
      <li
        draggable
        onDragStart={() => sort.id = task.id}
        onDragEnter={() => sort.to = task.priority}
        onDragEnd={() => this.handleDragEnd()}
      >
        <span>{task.priority} {task.content}</span>
        <span onClick={() => this.handleClickDeleteButton()}>[DELETE]</span>
        <span onClick={() => this.handleClickCompleteButton()}>[{(task.completed) ? 'to COMPLETE' : 'to UNCOMPLETE'}]</span>
      </li>
    );
  }
}

class TaskList extends React.Component<any, any> {
  public render() {
    return (
      <ul>
        {this.props.tasks.map((task: any) => {
          return <TaskListItem key={task.id} task={task} actions={this.props.actions}/>;
        })}
      </ul>
    );
  }
}

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
                <TaskList
                  tasks={groupedTasks}
                  actions={actions}
                />
              </RecycleTableContentListItem>
            );
          })}
        </RecycleTableContentList>
      </RecycleTable>
    );
  }
}
