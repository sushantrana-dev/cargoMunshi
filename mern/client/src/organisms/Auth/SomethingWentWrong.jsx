import React from 'react';
import { Result } from 'antd';
import { Navigate } from 'react-router-dom';
const App = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Navigate to='/'>Back Home</Navigate>}
  />
);
export default App;