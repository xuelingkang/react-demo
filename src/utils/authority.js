// 授权工具
import {getAuth} from "@/utils/authentication"

export function hasOne(resources) {
    const { authorities } = getAuth();
    if (!authorities) {
        return false;
    }
    for (let i=0; i<resources.length; i++) {
        if (authorities.includes(resources[i])) {
            return true;
        }
    }
    return false;
}

export function hasAll(resources) {
    const { authorities } = getAuth();
    if (!authorities) {
        return false;
    }
    for (let i=0; i<resources.length; i++) {
        if (!authorities.includes(resources[i])) {
            return false;
        }
    }
    return true;
}
