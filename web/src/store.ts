import Store from './libs/circuit';
import reducer from './reducers';

declare const window: any;

export default new Store(window.state, reducer);
