import * as React from 'react';

import {BackLink} from '../../libs/web-storyboard/back-link';
import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

import {
  createLabelWithRequest,
  updateLabelWithRequest,
} from '../../action-creators';

export default class LabelStoryboard extends Container<any, any> {
  public static propTypes = {};

  constructor(props: any) {
    super(props);

    this.state = Object.assign({}, this.state, {
      labelId: null,
      name: '',
      memberName: '',
      memberNames: [],
    });
    this.isPolling = true;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.labelId !== this.state.selectedLabelId) {
      const labelId = this.state.selectedLabelId;
      const label = (labelId) ? this.state.labels.filter((label: any) => label.id === labelId)[0] : null;
      if (label) {
        this.setState({
          labelId,
          name: label.name,
        });
      }
    }
  }

  handleChangeMemberName(event: any) {
    this.setState({
      memberName: event.currentTarget.value,
    });
  }

  handleClickAddButton(event: any) {
    const memberNames = this.state.memberNames.concat();
    memberNames.push(this.state.memberName);
    this.setState({
      memberName: '',
      memberNames,
    });
  }

  private isUpdate() {
    return (this.state.labelId !== null);
  }

  public handleChangeNameInput(event: any) {
    this.setState({
      name: event.currentTarget.value,
    });
  }

  public handleClickCreateOrUpdateButton(event: any) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    const labelId = this.state.labelId;
    const memberNames = this.state.memberNames;

    if (labelId) {
      updateLabelWithRequest(dispatch, labelId, {
        name: this.state.name.trim(),
      }, {memberNames}, {accessToken: this.accessToken});
    } else {
      createLabelWithRequest(dispatch, {
        name: this.state.name.trim(),
      }, {memberNames}, {accessToken: this.accessToken});
    }
  }

  public render() {
    return (
      <section className="storyboard">
        <h1>LabelStoryboard</h1>
        <div>
          <BackLink>Back</BackLink>
        </div>
        <div>
          <h2>Name</h2>
          <input value={this.state.name} onChange={(event) => this.handleChangeNameInput(event)}></input>
          <h2>Current member</h2>
          <div>{this.state.memberNames.join(', ')}</div>
          <h2>Member Name</h2>
          <input value={this.state.memberName} onChange={(event: any) => this.handleChangeMemberName(event)} />
          <div onClick={(event: any) => this.handleClickAddButton(event)}>Add</div>
        </div>
        <div onClick={(event) => this.handleClickCreateOrUpdateButton(event)}>{(this.isUpdate() ? 'Update' : 'Create')}</div>
      </section>
    );
  }
}
