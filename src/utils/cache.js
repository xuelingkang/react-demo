/**
 * 本地缓存功能
 */
class Cache {
    prefix // 项目前缀，根据不同项目而定
    expires // 有效期，秒
    strage // 缓存策略
    /**
     * @param  {String} prefix  项目前缀
     * @param  {Number} expires 默认缓存时间单位秒
     * @param  {Object} strage 缓存策略
     */
    constructor (prefix, expires, strage) {
        if (prefix) {
            this.prefix = prefix.toString()
        }
        if (expires) {
            this.expires = parseInt(expires, 10)
        }
        if (strage) {
            this.strage = strage
        }
    }

    /**
     * 设置缓存
     * @param key           缓存名
     * @param value         缓存值
     * @param expires       缓存有效时间，秒，负数表示长期有效
     * @param strage        缓存策略，window.localStorage或window.sessionStorage
     * @returns {boolean}   成功：true, 失败：false
     */
    set (key, value, expires, strage) {
        // 非法缓存名过滤
        if (key === undefined || key === '' || typeof key === 'object') {
            console.error('设置的缓存名不合法！')
            return false
        }

        // 非法缓存时间过滤
        if (!expires || typeof expires !== 'number') {
            expires = this.expires
        } else {
            expires = parseInt(expires, 10)
        }

        // 非法strage过滤
        if (!strage) {
            strage = this.strage
        }

        // storage中存储数据的键值
        let cacheName = this.prefix + '-[' + key.toString() + ']'
        // 获取过期到秒的时间戳
        let expiresTime
        if (expires<0) {
            expiresTime = expires
        } else {
            expiresTime = Date.parse(new Date()) / 1000 + expires
        }
        // 初始化存储数据
        const data = {
            type: typeof value,
            value: value,
            expires: expiresTime
        }

        // 存入storage
        try {
            strage.setItem(cacheName, JSON.stringify(data))
            return true
        } catch (err) {
            console.error('存储失败：' + JSON.stringify(err))
            return false
        }
    }

    /**
     * 读取缓存内容
     * @param key
     * @returns {*}
     */
    get (key) {
        // 获取当前到秒的时间戳，用于判断是否过期
        let currentTime = Date.parse(new Date()) / 1000

        // 非法缓存名过滤
        if (key === undefined || key === '' || typeof key === 'object') {
            console.error('读取的缓存名不合法！')
            return null
        }

        // 获取storage中要读取的缓存名
        let cacheName = this.prefix + '-[' + key.toString() + ']'
        try {
            let cacheStr = window.localStorage.getItem(cacheName)
            if (!cacheStr) {
                cacheStr = window.sessionStorage.getItem(cacheName)
            }
            const cacheData = JSON.parse(cacheStr)
            // 判断缓存是否过期
            if (cacheData.expires >= 0 && cacheData.expires < currentTime) {
                return null
            }
            return cacheData.value
        } catch (err) {
            return null
        }
    }

    /**
     * 移除一个缓存
     * @param key
     * @returns {boolean}
     */
    remove (key) {
        // 非法缓存名过滤
        if (key === undefined || key === '' || typeof key === 'object') {
            console.error('移除的缓存名不合法！')
            return false
        }
        let cacheName = this.prefix + '-[' + key.toString() + ']'
        try {
            window.localStorage.removeItem(cacheName)
            window.sessionStorage.removeItem(cacheName)
            return true
        } catch (err) {
            console.error('移除指定缓存数据失败：' + JSON.stringify(err))
            return false
        }
    }

    /**
     * 清空所有缓存数据
     */
    clear () {
        try {
            window.localStorage.clear()
            window.sessionStorage.clear()
            return true
        } catch (err) {
            console.error('清空所有缓存数据失败：' + JSON.stringify(err))
            return false
        }
    }
}

const prefix = 'react-demo'
const expires = 24 * 60 * 60
const strage = window.localStorage

const _this = new Cache(prefix, expires, strage)
export default _this
