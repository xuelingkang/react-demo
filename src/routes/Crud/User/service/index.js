import { axiosGet, axiosDelete, axiosPost, axiosPut, JSON_HEADER } from '@/utils/axios';

export const save = payload => axiosPost('/user', payload, JSON_HEADER);

export const update = payload => axiosPut('/user', payload, JSON_HEADER);

export const del = payload => axiosDelete('/user/{ids}', payload);

export const detail = payload => axiosGet('/user/{id}', payload);

export const findAllUsers = () => axiosGet('/user/all');
