import { axiosGet, axiosDelete, axiosPut, axiosPost } from '@/utils/axios';

export const getAllCategory = () => axiosGet('/resource/categorys');

export const save = payload => axiosPost('/resource', payload);

export const update = payload => axiosPut('/resource', payload);

export const del = payload => axiosDelete('/resource/{ids}', payload);

export const detail = payload => axiosGet('/resource/{id}', payload);
