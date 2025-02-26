import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: `http://${import.meta.env.PUBLIC_HOST}:${
    import.meta.env.PUBLIC_PORT
  }`,
});
interface RequestOptions {
  method: 'POST' | 'GET' | 'DELETE';
  url: string;
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
}
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    if ([200, 201].includes(response.status)) {
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
    if ([400, 500].includes(err.status)) {
      message.error(err.response?.data?.message || err?.message);
      return Promise.reject(message); // 一定要抛出reject，不然request会认为你的请求是成功的
    }
  }
);

function replacePathParams(path, params) {
  // 匹配路径中类似 {id} 这样的部分
  return path.replace(/{(\w+)}/g, (match, param) => {
    return params[param] !== undefined ? params[param] : match;
  });
}

export const request = async <T>({
  method = 'GET',
  options,
  url,
}: {
  method: string;
  url: string;
  options: {
    query?: any;
    params?: any;
    body?: any;
    headers?: any;
  };
}): Promise<T> => {
  const tempUrl = replacePathParams(url, options.params);
  return await instance({
    method,
    url: tempUrl,
    params: options.query,
    data: options.body,
    headers: options.headers,
  });
};
