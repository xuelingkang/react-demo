import { axiosGet, axiosDelete, axiosPost, axiosPut, axiosPatch, JSON_HEADER } from '@/utils/axios';

export const save = payload => axiosPost('/mail', payload, JSON_HEADER);

export const update = payload => axiosPut('/mail', payload, JSON_HEADER);

export const detail = payload => axiosGet('/mail/{id}', payload);

export const del = payload => axiosDelete('/mail/{ids}', payload);

export const send = payload => axiosPatch('', payload);
