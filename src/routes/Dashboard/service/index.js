import {axiosGet} from '@/utils/axios';

export const broadcastMonth = () => axiosGet('/summary/broadcast/month');

export const mailMonth = () => axiosGet('/summary/mail/month');

export const broadcastSendUser = () => axiosGet('/summary/broadcast/senduser');

export const mailSendUser = () => axiosGet('/summary/mail/senduser');

export const userSex = () => axiosGet('/summary/user/sex');
