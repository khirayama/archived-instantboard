import * as React from 'react';

import {BackLink} from '../../libs/web-storyboard/back-link';
import {Link} from '../../libs/web-storyboard/link';

import Container from '../container';

import {createLabel} from '../../action-creators';

export default class LabelStoryboard extends Container<any, any> {
  public static propTypes = {};

  constructor(props: any) {
    super(props);

    this.state = Object.assign({}, this.state, {
      name: '',
    });
  }

  public handleChangeNameInput(event: any) {
    this.setState({
      name: event.currentTarget.value.trim(),
    });
  }

  public handleClickCreateButton(event: any) {
    const dispatch = this.props.store.dispatch.bind(this.props.store);
    createLabel(dispatch, {
      name: this.state.name,
    }, {accessToken: this.accessToken});
  }

  public render() {
    return (
      <section className="storyboard">
        <h1>LabelStoryboard</h1>
        <div>
          <BackLink>Back</BackLink>
        </div>
        <div>
          <Link href="/labels/1/members">Choose member</Link>
        </div>
        <div>
          <input onChange={(event) => this.handleChangeNameInput(event)}></input>
        </div>
        <div onClick={(event) => this.handleClickCreateButton(event)}>Create label</div>
      </section>
    );
  }
}
