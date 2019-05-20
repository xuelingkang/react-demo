import { axiosGet, axiosDelete, axiosPost, axiosPut, JSON_CONTENT_TYPE } from '@/utils/axios';

export const save = payload => axiosPost('/role', payload,
    {headers: {'Content-Type': JSON_CONTENT_TYPE}});

export const update = payload => axiosPut('/role', payload,
    {headers: {'Content-Type': JSON_CONTENT_TYPE}});

export const del = payload => axiosDelete('/role/{ids}', payload);

export const detail = payload => axiosGet('/role/{id}', payload);

export const findAllResources = () => axiosGet('/resource/all');
