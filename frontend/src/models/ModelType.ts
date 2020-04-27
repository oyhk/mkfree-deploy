import { Effect, Reducer, Subscription, UserModelState } from '@@/plugin-dva/connect';

export interface ModelType<T> {
  namespace: string;
  state: T;
  effects: {
    login: Effect,
    logout: Effect,
  };
  reducers: {
    save: Reducer<T>;
  };
  subscriptions: { setup: Subscription };
}
