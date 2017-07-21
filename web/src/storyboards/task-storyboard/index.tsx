import * as React from 'react';

import {BackLink} from '../../libs/web-storyboard/back-link';

import Container from '../container';

import {createTask, updateTask} from '../../action-creators';

export default class TaskStoryboard extends Container<any, any> {
  public static propTypes = {};

  constructor(props: any) {
    super(props);

    this.state = Object.assign({}, this.state, {
      taskId: null,
      content: '',
      labelId: (this.state.labels[0]) ? this.state.labels[0].id : null,
    });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.taskId !== this.state.selectedTaskId) {
      const taskId = this.state.selectedTaskId;
      const task = (taskId) ? this.state.tasks.filter((task: any) => task.id === taskId)[0] : null;
      if (task) {
        this.setState({
          taskId,
          content: task.content,
        });
      }
    }
    if (!prevState.labelId) {
      const labelId = this.state.selectedLabelId || (this.state.labels[0]) ? this.state.labels[0].id : null;
      this.setState({labelId});
    }
  }

  private isUpdate() {
    return (this.state.taskId !== null);
  }

  public handleChangeLabelSelect(event: any) {
    this.setState({
      labelId: event.currentTarget.value.trim(),
    });
  }

  public handleChangeContentInput(event: any) {
    this.setState({
      content: event.currentTarget.value.trim(),
    });
  }

  public handleClickCreateOrUpdateButton(event: any) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    const taskId = this.state.taskId;
    if (this.isUpdate()) {
      updateTask(dispatch, taskId, {
        labelId: this.state.labelId,
        content: this.state.content,
      }, {accessToken: this.accessToken});
    } else {
      createTask(dispatch, {
        labelId: this.state.labelId,
        content: this.state.content,
      }, {accessToken: this.accessToken});
    }
  }

  public render() {
    return (
      <section className="storyboard">
        <h1>TaskStoryboard</h1>
        <BackLink>Back</BackLink>
        <div>
          <select onChange={(event) => this.handleChangeLabelSelect(event)}>
            {this.state.labels.map((label: any, index: number) => <option value={label.id} key={index}>{label.name}</option>)}
          </select>
          <input value={this.state.content} onChange={(event) => this.handleChangeContentInput(event)}></input>
        </div>
        <div onClick={(event) => this.handleClickCreateOrUpdateButton(event)}>{(this.isUpdate() ? 'Update' : 'Create')}</div>
      </section>
    );
  }
}
