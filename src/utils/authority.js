// 授权工具
import {getAuth} from "@/utils/authentication";

/**
 * 检查是否拥有资源
 * @param {string} resource 资源标识
 * @param {object} [obj] 待返回对象
 * @returns {null} 如果拥有资源则返回obj，若!obj则返回true；否则返回null
 */
export const has = (resource, obj) => {
    const { authorities } = getAuth();
    if (!authorities) {
        return null;
    }
    if (!obj) {
        obj = true;
    }
    return authorities.includes(resource)? obj: null;
}

/**
 * 检查是否拥有其中一个资源
 * @param {array} resources 资源数组
 * @param {object} [obj] 待返回对象
 * @returns {null|boolean} 如果拥有资源则返回obj，若!obj则返回true；否则返回null
 */
export const hasOne = (resources, obj) => {
    const { authorities } = getAuth();
    if (!authorities) {
        return null;
    }
    if (!obj) {
        obj = true;
    }
    for (let i=0; i<resources.length; i++) {
        if (has(resources[i])) {
            return obj;
        }
    }
    return null;
}

/**
 * 检查是否拥有所有资源
 * @param {array} resources 资源数组
 * @param {object} [obj] 待返回对象
 * @returns {null|boolean} 如果拥有资源则返回obj，若!obj则返回true；否则返回null
 */
export const hasAll = (resources, obj) => {
    const { authorities } = getAuth();
    if (!authorities) {
        return null;
    }
    if (!obj) {
        obj = true;
    }
    for (let i=0; i<resources.length; i++) {
        if (!has(resources[i])) {
            return null;
        }
    }
    return obj;
}
