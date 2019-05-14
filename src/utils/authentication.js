import cache from "@/utils/cache"
import {TOKEN, AUTHORITIES} from "@/utils/cache-keys"

export function cacheAuth(token, authorities, remember) {
    const expires = 7 * 24 * 60 * 60;
    let strage;
    if (remember) {
        strage = window.localStorage;
    } else {
        strage = window.sessionStorage;
    }
    cache.set(TOKEN, token, expires, strage);
    cache.set(AUTHORITIES, authorities, expires, strage);
}
export function getAuth() {
    const token = cache.get(TOKEN);
    const authorities = cache.get(AUTHORITIES);
    return {token, authorities};
}
export function removeAuth() {
    cache.remove(TOKEN);
    cache.remove(AUTHORITIES);
}
