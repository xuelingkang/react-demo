import {axiosGet, axiosDelete, axiosPost, JSON_HEADER} from '@/utils/axios';

export const save = payload => axiosPost('/broadcast', payload, JSON_HEADER);

export const detail = payload => axiosGet('/broadcast/{id}', payload);

export const del = payload => axiosDelete('/broadcast/{ids}', payload);
