import { axiosGet, axiosDelete, axiosPost, axiosPut, JSON_HEADER } from '@/utils/axios';

export const save = payload => axiosPost('/role', payload, JSON_HEADER);

export const update = payload => axiosPut('/role', payload, JSON_HEADER);

export const del = payload => axiosDelete('/role/{ids}', payload);

export const detail = payload => axiosGet('/role/{id}', payload);

export const findAllResources = () => axiosGet('/resource/all');
