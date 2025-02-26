import { request } from '@/services/request';

export const loginDispatch = async <T>(data: any) => {
  const info = await request<T>({
    method: 'POST',
    options: data,
    url: '/user/login',
  });
  return info as T;
};
