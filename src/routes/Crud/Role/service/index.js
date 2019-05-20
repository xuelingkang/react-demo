import { axiosGet, axiosDelete, axiosPost, axiosPut } from '@/utils/axios';

export const save = payload => axiosPost('/role', payload);

export const update = payload => axiosPut('/role', payload);

export const del = payload => axiosDelete('/role/{ids}', payload);

export const detail = payload => axiosGet('/role/{id}', payload);

export const findAllResources = () => axiosGet('/resource/all');
