import React from 'react';
import {
  RouterProvider,
} from "react-router-dom";
import { ConfigProvider } from 'antd';
import routers from './routers';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
// import '@wangeditor/editor/dist/css/style.css'
import './App.css';
const App = () => {
  return <ConfigProvider locale={zhCN}>
    <RouterProvider router={routers}
      future={{
        v7_startTransition: false,
        // v7_relativeSplatPath: false,
      }}
    />
  </ConfigProvider>

};

export default App;

