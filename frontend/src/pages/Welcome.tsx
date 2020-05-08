import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const Welcome: React.FC = () => {
  return (
    <PageHeaderWrapper>
      Hello World!
      <br/>
      {JSON.stringify(process.env)}

    </PageHeaderWrapper>

  );
};
export default Welcome;
