import * as React from 'react';

import {BackLink} from '../../libs/web-storyboard/back-link';

import Container from '../container';

import {createTask} from '../../action-creators';

export default class TaskStoryboard extends Container<any, any> {
  public static propTypes = {};

  constructor(props: any) {
    super(props);

    this.state = Object.assign({}, this.state, {
      content: '',
      labelId: null,
    });
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

  public handleClickCreateButton(event: any) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    createTask(dispatch, {
      labelId: this.state.labelId,
      content: this.state.content,
    }, {accessToken: this.accessToken});
  }

  public render() {
    return (
      <section className="storyboard">
        <h1>TaskStoryboard</h1>
        <BackLink>Back</BackLink>
        <div>
          <select onChange={(event) => this.handleChangeLabelSelect(event)}>
            {this.state.labels.map((label, index) => <option value={label.id} key={index}>{label.name}</option)}
          </select>
          <input onChange={(event) => this.handleChangeContentInput(event)}></input>
        </div>
        <div onClick={(event) => this.handleClickCreateButton(event)}>Create task</div>
      </section>
    );
  }
}
