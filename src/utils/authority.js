// 授权工具
import {getAuth} from "@/utils/authentication";

/**
 * 检查是否拥有资源
 */
export const has = resource => {
    const { authorities } = getAuth();
    if (!authorities) {
        return false;
    }
    return authorities.includes(resource);
}

/**
 * 检查是否拥有其中一个资源
 */
export const hasOne = resources => {
    const { authorities } = getAuth();
    if (!authorities) {
        return false;
    }
    for (let i=0; i<resources.length; i++) {
        if (has(resources[i])) {
            return true;
        }
    }
    return false;
}

/**
 * 检查是否拥有所有资源
 */
export const hasAll = resources => {
    const { authorities } = getAuth();
    if (!authorities) {
        return false;
    }
    for (let i=0; i<resources.length; i++) {
        if (!has(resources[i])) {
            return false;
        }
    }
    return true;
}
