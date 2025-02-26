import { request } from '@/services/request';

export interface EmploymentListItem {
  id: number;
  idCard: string;
  bank: string;
  name: string;
  bankName: string;
  bankLocation: string;
  phone: string;
}
export interface EmploymentListInfo {
  data: EmploymentListItem[];
  total: number;
}
export const employmentListDispatch = async <T>(data: any) => {
  const info = await request<T>({
    method: 'GET',
    options: data,
    url: '/employment/list',
  });
  return info as T;
};

export const deleteEmploymentDispatch = async <T>(data: any) => {
  const info = await request<T>({
    method: 'DELETE',
    options: data,
    url: '/employment/delete',
  });
  return info as T;
};

export const exportEmploymentDispatch = async <T>(data: any) => {
  const info = await request<T>({
    method: 'GET',
    options: data,
    url: '/employment/export',
  });
  return info as T;
};
