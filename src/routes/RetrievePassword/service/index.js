import { axiosPost } from '@/utils/axios';

export async function retrievePasswordEmail(payload) {
    return axiosPost('/userinfo/retrieve_password', payload);
}

export async function retrievePassword(payload) {
    return axiosPost('/userinfo/retrieve_password_mail', payload);
}
