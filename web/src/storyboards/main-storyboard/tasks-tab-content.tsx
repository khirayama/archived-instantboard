import * as React from 'react';

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

class Labels extends React.Component<any, any> {
  public render() {
    return (
      <ul>{this.props.labels.map(label => {
        return (<li>{label.name}</li>);
      })}</ul>
    );
  }
}

export class TasksTabContent extends React.Component<any, any> {
  public render() {
    const tasks = this.props.tasks;
    const labels = this.props.labels;
    const actions = this.props.actions;
    console.log(tasks, labels);
    return (
      <div>
      <Labels labels={labels} />
      <TaskList
        tasks={tasks}
        actions={actions}
      />
      </div>
    );
  }
}
