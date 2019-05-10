import { axiosPost } from '@/utils/axios';

export async function login(payload) {
  return axiosPost('/login', payload);
}
