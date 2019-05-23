// 认证工具
import cache from "@/utils/cache";
import {TOKEN, AUTHORITIES, USER} from "@/utils/cache-keys";
import { axiosGet } from "@/utils/axios";

export function cacheAuth(token, authorities, user, remember) {
    const expires = 7 * 24 * 60 * 60;
    let strage;
    if (remember) {
        strage = window.localStorage;
    } else {
        strage = window.sessionStorage;
    }
    cache.set(TOKEN, token, expires, strage);
    cache.set(AUTHORITIES, authorities, expires, strage);
    cache.set(USER, user, expires, strage);
}
export function getAuth() {
    const token = cache.get(TOKEN);
    const authorities = cache.get(AUTHORITIES);
    return {token, authorities};
}
export function removeAuth() {
    axiosGet('/logout')
        .then(() => (removeLocalAuth()), () => (removeLocalAuth()))
        .catch(() => (removeLocalAuth()));
}
function removeLocalAuth() {
    cache.remove(TOKEN);
    cache.remove(AUTHORITIES);
    cache.remove(USER);
}
