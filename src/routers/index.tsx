/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
// import Layout from "@/layout";
// import Login from "@/pages/login";
import {
  createBrowserRouter,
} from "react-router-dom";


const Login = lazy(() => import('@/pages/login'));
const User = lazy(() => import('@/pages/user'));
const Task = lazy(() => import('@/pages/task/list'));
const Layout = lazy(() => import('@/layout'));
const Employment = lazy(() => import('@/pages/employment'));


const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/task',
        element: <Task />,
      },
      {
        path: '/employment',
        element: <Employment />,
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/user',
    element: <User />,
  }
])

export default routes;