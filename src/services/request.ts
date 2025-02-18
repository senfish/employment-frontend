import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';

console.log('import.meta.env.VITE_HOST', import.meta.env.VITE_HOST);

const instance = axios.create({
  baseURL: `http://${import.meta.env.VITE_HOST}:3000`,
});
interface RequestOptions {
  method: 'POST' | 'GET' | 'DELETE';
  url: string;
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
}
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data?.code?.startsWith('100')) {
        // 状态码是200，但是code是以100开头，说明是业务错误
        message.error(response.data?.message);
        return Promise.reject(response.data);
      }
      return response.data.data;
    }
    return response;
  },
  (err) => {
    if (err.status === 401) {
      window.location.href = '/login';
    }
    if (err.status === 400) {
      message.error(err.response?.data?.message || err?.message);
      return Promise.reject(message); // 一定要抛出reject，不然request会认为你的请求是成功的
    }
  },
);

export const request = async <T>({
  method = 'GET',
  url,
  params = {},
  data = {},
}: RequestOptions): Promise<T> => {
  const token = localStorage.getItem('token');
  return await instance({
    method,
    url,
    params,
    data,
    headers: {
      Authorization: token,
    },
  });
};
