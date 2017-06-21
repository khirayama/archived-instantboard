import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactTransitionGroup from 'react-addons-transition-group';

import Storyboard from './storyboard';
import {isBrowser} from './utils';

export default class Navigator extends React.Component<any, any> {
  public static propTypes = {
    path: PropTypes.string.isRequired,
    router: PropTypes.shape({
      isRootStoryboard: PropTypes.func.isRequired,
      getStoryboardByKey: PropTypes.func.isRequired,
      getStoryboardByPath: PropTypes.func.isRequired,
      getRootStoryboard: PropTypes.func.isRequired,
      getSegue: PropTypes.func.isRequired,
    }).isRequired,
  };

  public static childContextTypes = {
    move: PropTypes.func,
    isBack: PropTypes.func,
    getSegue: PropTypes.func,
    calcBackPath: PropTypes.func,
  };

  private nav: INavigation = {
    currentIndex: 0,
    isBack: false,
    browserHistoryLength: 0,
    histories: [],
  };

  constructor(props: any) {
    super(props);

    this.nav = this.loadNav(props.path);

    const currentHistory: IHistory = this.getCurrentHistory();

    // Reset: root storyboard || currentHistory.path !== path || currentBrowserHistory.length !== window.history.length
    if (
      this.props.router.isRootStoryboard(props.path) ||
      (currentHistory && currentHistory.path !== props.path) ||
      (isBrowser() && this.nav.browserHistoryLength !== window.history.length)
    ) {
      this.resetNav();
    }
    if (
      !currentHistory ||
      (currentHistory.path !== props.path)
    ) {
      this.pushHistory(props.path);
    }

    this.state = {
      nav: this.nav,
    };
  }

  public getChildContext() {
    return {
      move: (path: string) => this.move(path),
      isBack: () => this.nav.isBack,
      getSegue: (isBack: boolean) => this.getSegue(isBack),
      calcBackPath: () => this.calcBackPath(),
    };
  }

  public componentDidMount() {
    if (isBrowser()) {
      window.addEventListener('popstate', () => {
        const path: string = window.location.pathname;
        const nextHistory: IHistory = this.getNextHistory();

        if (nextHistory && nextHistory.path === path) {
          this.forward();
        } else {
          this.back();
        }
        this.setState({nav: this.nav});
      });
    }
  }

  public render() {
    const history: IHistory = this.getCurrentHistory();
    const storyboard: any = history.storyboard;

    return (
      <section className="navigator">
        <ReactTransitionGroup>
          <Storyboard
            {...this.props}
            key={storyboard.key + new Date().getTime()}
            component={storyboard.component}
            router={this.props.router}
            />
        </ReactTransitionGroup>
      </section>
    );
  }

  private loadNav(path: string): INavigation {
    if (isBrowser() && window.sessionStorage) {
      const navString: string|null = window.sessionStorage.getItem('__web_storyboard_nav');

      if (navString)  {
        const nav: INavigation = JSON.parse(navString);
        if (nav !== null) {
          nav.histories = nav.histories.map((navHistory): IHistory => {
            navHistory.storyboard = this.props.router.getStoryboardByKey(navHistory.storyboard.key);
            return navHistory;
          });
          return nav;
        }
      }
    }
    return {
      isBack: false,
      currentIndex: -1,
      histories: [],
      browserHistoryLength: (isBrowser()) ? window.history.length : 0,
    };
  }

  private resetNav(): void {
    this.nav = {
      currentIndex: -1,
      isBack: false,
      histories: [],
      browserHistoryLength: (isBrowser()) ? window.history.length : 0,
    };
  }

  private saveNav(): void {
    if (isBrowser() && window.sessionStorage) {
      window.sessionStorage.setItem('__web_storyboard_nav', JSON.stringify(this.nav));
    }
  }

  private pushHistory(path: string): void {
    const nextStoryboard: any = this.props.router.getStoryboardByPath(path);

    const currentHistory: IHistory = this.getCurrentHistory();
    const segue = (currentHistory === null) ? null : this.props.router.getSegue(
      currentHistory.storyboard.key,
      nextStoryboard.key,
    );
    this.nav.histories.splice(this.nav.currentIndex + 1, this.nav.histories.length);

    const newHistory: IHistory = {
      path,
      storyboard: nextStoryboard,
      segue,
    };

    this.nav.isBack = false;
    this.nav.currentIndex += 1;
    this.nav.histories.push(newHistory);
    this.nav.browserHistoryLength = (isBrowser()) ? window.history.length : 0;

    this.saveNav();
  }

  private getPrevHistory(): IHistory {
    return this.nav.histories[this.nav.currentIndex - 1] || null;
  }

  private getCurrentHistory(): IHistory {
    return this.nav.histories[this.nav.currentIndex] || null;
  }

  private getNextHistory(): IHistory {
    return this.nav.histories[this.nav.currentIndex + 1] || null;
  }

  private getSegue(isBack: boolean): ISegue {
    return (isBack) ? this.getNextHistory().segue : this.getCurrentHistory().segue;
  }

  private move(path: string) {
    const prevHistory: IHistory = this.getPrevHistory();

    if (prevHistory && prevHistory.path === path) {
      window.history.back();
    } else {
      window.history.pushState(null, '', path);
      this.pushHistory(path);
      this.setState({nav: this.nav});
    }
  }

  private forward() {
    if (this.nav.currentIndex < this.nav.histories.length) {
      this.nav.isBack = false;
      this.nav.currentIndex += 1;
      this.saveNav();
    }
  }

  private back() {
    if (this.nav.currentIndex > -1) {
      this.nav.isBack = true;
      this.nav.currentIndex -= 1;
      this.saveNav();
    }
  }

  private calcBackPath() {
    const prevHistory = this.getPrevHistory();

    if (prevHistory) {
      return prevHistory.path;
    }
    return this.props.router.getRootStoryboard().path;
  }
}
