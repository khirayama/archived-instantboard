import * as PropTypes from 'prop-types';
import * as React from 'react';

import {
  Tabs,
  TabList,
  TabListItem,
  TabContentList,
  TabContentListItem,
} from '../../components/tabs';

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

class Label extends React.Component<any, any> {
  private static contextTypes = {
    getIndex: PropTypes.func,
    setIndex: PropTypes.func,
  };
  public render() {
    const classNames = ['label'];
    const index = this.props.index;
    if (index === this.context.getIndex()) {
      classNames.push('label__current');
    }
    return (
      <div
        className={classNames.join(' ')}
        onClick={(event: any) => this.context.setIndex(index)}
      >{this.props.children}</div>
    );
  }
}

class Labels extends React.Component<any, any> {
  public render() {
    return (
      <div className="labels">{this.props.children}</div>
    );
  }
}

class LabelTable extends React.Component<any, any> {
  private static childContextTypes = {
    getIndex: PropTypes.func,
    setIndex: PropTypes.func,
  };
  private getChildContext() {
    return {
      getIndex: this.getIndex.bind(this),
      setIndex: this.setIndex.bind(this),
    };
  }
  constructor(props: any) {
    super(props);
    const initialIndex = props.initialIndex || 0;

    this.state = {
      index: initialIndex,
    };
  }
  private getIndex(index: number) {
    return this.state.index;
  }
  private setIndex(index: number|null) {
    if (index !== null && this.state.index !== index) {
      this.setState({index});
      // this.props.onChange(index);
    }
  }
  public render() {
    return (
      <div className="label-table">{this.props.children}</div>
    );
  }
}

export class TasksTabContent extends React.Component<any, any> {
  public render() {
    const tasks = this.props.tasks;
    const labels = this.props.labels;
    const actions = this.props.actions;
    return (
      <Tabs>
      <TabList>
        {labels.map((label: any, index: number) => {
          return <TabListItem key={label.id} index={index}>{label.name}</TabListItem>
        })}
      </TabList>

      <TabContentList>
        {labels.map((label: any, index: number) => {
          const groupedTasks = tasks.filter((task: any) => {
            return (task.labelId === label.id);
          });
          return (
            <TabContentListItem key={index}>
              <TaskList
                tasks={groupedTasks}
                actions={actions}
              />
            </TabContentListItem>
          );
        })}
      </TabContentList>
      </Tabs>
    );
  }
}
