import { axiosGet, axiosDelete, axiosPost, axiosPut, JSON_HEADER } from '@/utils/axios';

export const save = payload => axiosPost('/open', payload, JSON_HEADER);

export const update = payload => axiosPut('/open', payload, JSON_HEADER);

export const detail = payload => axiosGet('/open/{id}', payload);

export const del = payload => axiosDelete('/open/{ids}', payload);
