/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, Spin } from 'antd';
import { Suspense, useEffect, useState } from "react";
import _ from 'lodash';
import { menus } from "./menu";
import { Badge, TabBar } from 'antd-mobile'


import './index.less';
import { AppOutline, UnorderedListOutline } from "antd-mobile-icons";

interface MenuItem {
  key: string,
  children: MenuItem[]
}
const tabs = [{
  key: 'home',
  title: '员工信息管理',
  icon: <AppOutline />,
}]
const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<{ label: string, key: string } | Record<string, string>>({});
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/login')
    }
    const paths = location.pathname.split('/');
    if (paths[1]) {
      setOpenKeys([paths[1]])
    }
  }, []);
  useEffect(() => {
    setSelectedKeys(location.pathname);
    const target = findOnSelectMenuItem(menus as MenuItem[], location.pathname)
    if (!_.isEmpty(target)) {
      setSelectedMenu(target)
    }
  }, [location.pathname]);

  const findOnSelectMenuItem = (menus: MenuItem[], path: string) => {
    let target = {};
    const dfs = (menus: MenuItem[]) => {
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].key === path) {
          target = menus[i];
          break;
        }
        if (Array.isArray(menus[i]?.children)) {
          dfs(menus[i]?.children)
        }
      }
    }
    dfs(menus)
    return target;
  }
  return <div className="employment-layout">
    <TabBar>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
    <Suspense fallback={<Spin spinning={true} />} >
      <Outlet />
    </Suspense>
  </div>
  // return <div className="employment-layout">
  //   <div className="employment-sider">
  //     <div className="employment-sider-header">信息录入后台</div>
  //     <Menu
  //       className="employment-menu"
  //       theme="dark"
  //       mode="horizontal"
  //       items={menus}
  //       selectedKeys={[selectedKeys]}
  //       onOpenChange={(openKeys) => {
  //         setOpenKeys(openKeys)
  //       }}
  //       openKeys={openKeys}
  //       onSelect={(items) => {
  //         navigate(items.key);
  //       }}
  //     >
  //     </Menu>
  //   </div>
  //   <div className="employment-content">
  //     <div className="employment-content-header">{selectedMenu?.label}</div>
  //     <Suspense fallback={<Spin spinning={true} />} >
  //       <Outlet />
  //     </Suspense>
  //   </div>

  // </div>
}


export default Layout;