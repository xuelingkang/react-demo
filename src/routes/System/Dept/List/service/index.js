import { axiosGet } from '@/utils/axios';

export async function getAllDept() {
    return axiosGet('/dept/all');
}
