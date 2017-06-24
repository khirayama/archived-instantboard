import * as PropTypes from 'prop-types';
import * as React from 'react';

import {Link} from '../../libs/web-storyboard/link';

import {createToken} from '../../action-creators';
import {setAccessToken} from '../../utils';
import Container from '../container';

declare const window: any;

export default class LoginStoryboard extends Container<any, any> {
  public static contextTypes = {
    move: PropTypes.func,
  };

  public componentDidMount() {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: '772950426216569',
        xfbml: true,
        version: 'v2.8',
        status: true,
      });
      window.FB.AppEvents.logPageView();
    };

    ((d, s, id) => {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js: any = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      if (fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, 'script', 'facebook-jssdk');
  }
  public handleClickLoginWithFacebook() {
    window.FB.login((res: any) => {
      const provider = 'facebook';
      const uid = res.authResponse.userID;
      createToken({
        provider,
        uid,
      }).then((accessToken: string) => {
        if (accessToken) {
          setAccessToken(accessToken);
          this.context.move('/');
        }
      });
    });
  }
  public render() {
    return (
      <section className="storyboard">
        <div onClick={() => this.handleClickLoginWithFacebook()}>Login with Facebook</div>
      </section>
    );
  }
}
