import { axiosGet, axiosDelete, axiosPost, axiosPut, JSON_HEADER } from '@/utils/axios';

export const save = payload => axiosPost('/jobTemplate', payload, JSON_HEADER);

export const update = payload => axiosPut('/jobTemplate', payload, JSON_HEADER);

export const detail = payload => axiosGet('/jobTemplate/{id}', payload);

export const del = payload => axiosDelete('/jobTemplate/{ids}', payload);

export const findAllJobTemplate = () => axiosGet('/jobTemplate/all');
