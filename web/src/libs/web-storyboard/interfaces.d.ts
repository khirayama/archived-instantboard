interface IStoryboardOptions {
  args: any;
  initialize: any;
  title: any;
}

interface IStoryboard {
  root?: boolean;
  key: string;
  component: any;
  path: string;
  options: IStoryboardOptions;
  params?: any;
}

interface ISegue {
  from: string;
  to: string;
  type: string;
}

interface IHistory {
  path: string;
  storyboard: IStoryboard;
  segue: ISegue;
}

interface INavigation {
  currentIndex: number;
  isBack: boolean;
  browserHistoryLength: number;
  histories: IHistory[];
}
