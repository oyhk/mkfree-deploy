import { ConnectProps, UserModelState } from '@@/plugin-dva/connect';

export interface UserPageProps extends ConnectProps {
  user: UserModelState;
}
