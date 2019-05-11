import { axiosPost } from '@/utils/axios';

export async function register(payload) {
  return axiosPost('/userinfo', payload);
}