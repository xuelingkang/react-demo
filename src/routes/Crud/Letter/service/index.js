import { axiosGet, axiosDelete, axiosPost, JSON_HEADER } from '@/utils/axios';

export const save = payload => axiosPost('/letter', payload, JSON_HEADER);

export const detail = payload => axiosGet('/letter/{id}', payload);

export const del = payload => axiosDelete('/letter/{ids}', payload);

export const saveReply = payload => axiosPost('/letterReply', payload, JSON_HEADER);

export const delReply = payload => axiosDelete('/letterReply/{ids}', payload);

export const pageReply = payload => axiosGet('/letterReply/{current}/{size}', payload);
