import React from 'react';
import { UseAPIProvider } from '@umijs/use-request';
import Request1 from '@/utils/Request1';

const BlankLayout: React.FC = props => {
  return (
    <UseAPIProvider value={{
      refreshOnWindowFocus: true,
      requestMethod: (options) => Request1(options.url, options),
    }}>
      {props.children}
    </UseAPIProvider>
  );
  /*return(<div>{props.children}</div>)*/
};
export default BlankLayout;
