import * as React from 'react';

import {BackLink} from '../../libs/web-storyboard/back-link';
import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

import {createLabel, updateLabel} from '../../action-creators';

export default class LabelStoryboard extends Container<any, any> {
  public static propTypes = {};

  constructor(props: any) {
    super(props);

    this.state = Object.assign({}, this.state, {
      labelId: null,
      name: '',
    });
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

  private isUpdate() {
    return (this.state.labelId !== null);
  }

  public handleChangeNameInput(event: any) {
    this.setState({
      name: event.currentTarget.value.trim(),
    });
  }

  public handleClickCreateOrUpdateButton(event: any) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    const labelId = this.state.labelId;
    if (labelId) {
      updateLabel(dispatch, labelId, {
        name: this.state.name,
      }, {accessToken: this.accessToken});
    } else {
      createLabel(dispatch, {
        name: this.state.name,
      }, {accessToken: this.accessToken});
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
          <Link href={`/labels/${this.state.labelId}/members`}>Choose member</Link>
        </div>
        <div>
          <input value={this.state.name} onChange={(event) => this.handleChangeNameInput(event)}></input>
        </div>
        <div onClick={(event) => this.handleClickCreateOrUpdateButton(event)}>{(this.isUpdate() ? 'Update' : 'Create')}</div>
      </section>
    );
  }
}
