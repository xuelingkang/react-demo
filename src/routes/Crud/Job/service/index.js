import { axiosGet, axiosDelete, axiosPost, axiosPut, axiosPatch, JSON_HEADER } from '@/utils/axios';

export const save = payload => axiosPost('/job', payload, JSON_HEADER);

export const update = payload => axiosPut('/job', payload, JSON_HEADER);

export const pause = payload => axiosPatch('/job/pause/{id}', payload);

export const resume = payload => axiosPatch('/job/resume/{id}', payload);

export const detail = payload => axiosGet('/job/{id}', payload);

export const del = payload => axiosDelete('/job/{ids}', payload);
