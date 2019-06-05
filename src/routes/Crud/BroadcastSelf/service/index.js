import {axiosGet, axiosPut} from '@/utils/axios';

export const update = payload => axiosPut('/broadcast/{ids}', payload);

export const detail = payload => axiosGet('/broadcast/self/{id}', payload);
