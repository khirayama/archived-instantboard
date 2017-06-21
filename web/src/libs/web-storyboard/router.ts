const PATH_REGEXP = new RegExp([
  '(\\\\.)',
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))',
].join('|'), 'g');

export function _parse(str: string) {
  const tokens = [];
  let index = 0;
  let path = '';
  let res = PATH_REGEXP.exec(str);

  while (res !== null) {
    const offset = res.index;

    path += str.slice(index, offset);
    index = offset + res[0].length;

    // if not exist path or empty string
    if (path) {
      tokens.push(path);
    }
    path = '';

    const token = {
      name: res[3],
      pattern: '[^/]+?',
    };
    tokens.push(token);
    res = PATH_REGEXP.exec(str);
  }

  if (index < str.length) {
    path += str.substr(index);
  }
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

export function _tokensToRegexp(tokens: any) {
  let route = '';
  const lastToken = tokens[tokens.length - 1];
  const endsWithSlash = (typeof lastToken === 'string' && /\/$/.test(lastToken));

  tokens.forEach((token: any) => {
    if (typeof token === 'string') {
      route += token;
    } else {
      let capture = token.pattern;
      capture = '/(' + capture + ')';
      route += capture;
    }
  });
  route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  route += '$';

  return new RegExp('^' + route, 'i');
}

export function _pathToRegexp(path: string) {
  const tokens = _parse(path);
  const regexp = _tokensToRegexp(tokens);

  const keys: any = [];
  tokens.forEach((token) => {
    if (typeof token !== 'string') {
      keys.push(token);
    }
  });

  return {
    regexp,
    keys,
  };
}

export function _getParams(keys: any, matches: any) {
  const params: any = {};

  if (matches) {
    keys.forEach((key: any, index: number) => {
      params[key.name] = matches[index + 1];
    });
  }
  return params;
}

export function _exec(regexp: RegExp, keys: string[], path: string): any {
  const matches: any = regexp.exec(path);
  const params = _getParams(keys, matches);

  return {
    matches,
    params,
  };
}

export default class Router {
  private segues: ISegue[];
  private storyboards: IStoryboard[];

  constructor(segues: ISegue[] = [], storyboards: IStoryboard[] = []) {
    this.segues = segues;
    this.storyboards = storyboards;
  }

  public isRootStoryboard(path: string): boolean {
    const storyboard: IStoryboard = this.getRootStoryboard();
    const {regexp, keys} = _pathToRegexp(storyboard.path || '');
    const {matches, params} = _exec(regexp, keys, path);
    return Boolean(matches);
  }

  public getRootStoryboard(): IStoryboard {
    for (const storyboard of this.storyboards) {
      if (storyboard.root) {
        return storyboard;
      }
    }
    return this.storyboards[0];
  }

  public getStoryboardByPath(path: string): IStoryboard|null {
    for (const storyboard of this.storyboards) {
      const {regexp, keys} = _pathToRegexp(storyboard.path || '');
      const {matches, params} = _exec(regexp, keys, path);
      if (matches) {
        storyboard.params = params;
        return storyboard;
      }
    }
    return null;
  }

  public getStoryboardByKey(storyboardKey: string) {
    for (const storyboard of this.storyboards) {
      if (storyboard.key === storyboardKey) {
        return storyboard;
      }
    }
    return null;
  }

  public getSegue(fromStoryboardKey: string, toStoryboardKey: string) {
    for (const segue of this.segues) {
      if (segue.from === fromStoryboardKey && segue.to === toStoryboardKey) {
        return segue;
      }
    }
    return null;
  }

  public initialize(path: string, payload: any) {
    return new Promise((resolve) => {
      const storyboard: IStoryboard|null = this.getStoryboardByPath(path);

      if (storyboard !== null) {
        const options = storyboard.options || {};
        const result: any = {};

        this.callArgs(options.args).then((args) => {
          this.callInitialize(options.initialize, storyboard.params, args, payload).then((value) => {
            result.value = value;
            this.callTitle(options.title, value).then((title) => {
              result.title = title;
              resolve(result);
            });
          });
        });
      }
    });
  }

  private callArgs(args: any) {
    let tmpArgs: any = args;
    return new Promise((resolve) => {
      if (typeof args === 'function') {
        tmpArgs = args();
        // Promise
        if (tmpArgs.then) {
          tmpArgs.then((finalArgs: any) => {
            resolve(finalArgs);
          });
        } else {
          resolve(tmpArgs);
        }
      } else {
        resolve(tmpArgs);
      }
    });
  }

  private callInitialize(initialize: any, params: any, args: any, payload: any) {
    const tmpInitialize = initialize || (() => null);

    return new Promise((resolve) => {
      const init: any = tmpInitialize(params, args, payload);

      if (init && init.then) {
        init.then((result: any) => {
          resolve(result);
        });
      } else {
        resolve(init);
      }
    });
  }

  private callTitle(title: any, value: any) {
    let tmpTitle: any = title;
    return new Promise((resolve) => {
      if (typeof title === 'function') {
        tmpTitle = title(value);
        if (tmpTitle.then) {
          tmpTitle.then((finalTitle: string) => {
            resolve(finalTitle);
          });
        } else {
          resolve(tmpTitle);
        }
      } else {
        resolve(tmpTitle);
      }
    });
  }
}
