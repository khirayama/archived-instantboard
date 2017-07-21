import * as React from 'react';

import {BackLink} from '../../libs/web-storyboard/back-link';

import Container from '../container';

import {createRequests} from '../../action-creators';

export default class MemberStoryboard extends Container<any, any> {
  public static propTypes = {};

  constructor(props: any) {
    super(props);

    this.state = Object.assign({}, this.state, {
      membername: '',
      membernames: [],
    });
  }

  handleChangeMembername(event: any) {
    this.setState({
      membername: event.currentTarget.value,
    });
  }

  handleClickAddButton(event: any) {
    const membernames = this.state.membernames.concat();
    membernames.push(this.state.membername);
    this.setState({
      membername: '',
      membernames,
    });
  }

  handleClickSendRequest(event: any) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    const membernames = this.state.membernames;

    createRequests(dispatch, {
      labelId: this.state.selectedLabelId,
      memberNames: membernames,
    }, {accessToken: this.accessToken});
  }

  public render() {
    return (
      <section className="storyboard">
        <h1>MemberStoryboard</h1>
        <div>{this.state.membernames.join(', ')}</div>
        <input value={this.state.membername} onChange={(event: any) => this.handleChangeMembername(event)} />
        <div onClick={(event: any) => this.handleClickAddButton(event)}>Add</div>
        <div onClick={(event: any) => this.handleClickSendRequest(event)}>Send requests</div>
        <BackLink>Back</BackLink>
      </section>
    );
  }
}
