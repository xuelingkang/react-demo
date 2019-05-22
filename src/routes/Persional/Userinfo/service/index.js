import { axiosGet, axiosPut } from '@/utils/axios';

export const update = payload => axiosPut('/userinfo', payload);

export const detail = () => axiosGet('/userinfo');
