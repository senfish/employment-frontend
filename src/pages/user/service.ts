import { request } from '@/services/request';

export const uploadBankCardDispatch = async <T>(data: any) => {
  const info = await request<T>({
    method: 'POST',
    options: data,
    url: '/upload/bank',
  });
  return info as T;
};

export const uploadIDCardDispatch = async <T>(data: any) => {
  const info = await request<T>({
    method: 'POST',
    options: data,
    url: '/upload/id-card',
  });
  return info as T;
};

export interface CreateEmployment {
  idCard: number | string;
  name: string;
  bank: string;
  address: string;
  bankBranch: string;
  phone: string;
}
export const submitDispatch = async <T>(data: any) => {
  const info = await request<T>({
    method: 'POST',
    options: data,
    url: '/employment/create',
  });
  return info as T;
};

// export const loginDispatch = async <T>(data) => {
//   const info = await request<T>({
//     method: "POST",
//     data: data,
//     url: "/user/login",
//   });
//   console.log("info", info);
//   return info as T;
// };
