import { axiosGet } from '@/utils/axios';

export async function getDeptList(payload) {
    return axiosGet('/dept/:current/:size', payload);
}
