import { axiosGet, axiosDelete, axiosDownload } from '@/utils/axios';

export const detail = payload => axiosGet('/attachment/{id}', payload);

export const del = payload => axiosDelete('/attachment/{ids}', payload);

export const download = url => axiosDownload(url);
