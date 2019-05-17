import { axiosGet, axiosPost, axiosDelete, axiosPut } from '@/utils/axios';

export const getAllDept = () => axiosGet('/dept/all');

export const save = payload => axiosPost('/dept', payload);

export const update = payload => axiosPut('/dept', payload);

export const del = payload => axiosDelete('/dept/{ids}', payload);

export const detail = payload => axiosGet('/dept/{id}', payload);
