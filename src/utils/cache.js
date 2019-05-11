/**
 * localStorage 本地缓存功能
 */
class Cache {
    prefix = 'react-demo' // 项目前缀，根据不同项目而定
    expires = 24 * 60 * 60 // 默认24小时后失效
    /**
     * @param  {String} prefix  项目前缀
     * @param  {Number} expires 默认缓存时间单位秒
     */
    constructor (prefix, expires) {
        if (prefix) {
            this.prefix = prefix.toString()
        }
        if (expires) {
            this.expires = parseInt(expires, 10)
        }
    }

    /**
     * 设置缓存
     * @param key           缓存名
     * @param value         缓存值
     * @param expires       缓存有效时间，秒
     * @returns {boolean}   成功：true, 失败：false
     */
    set (key, value, expires) {
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

        // localStorage中存储数据的键值
        let cacheName = this.prefix + '-[' + key.toString() + ']'
        // 获取过期到秒的时间戳
        let expiresTime = Date.parse(new Date()) / 1000 + expires
        // 初始化存储数据
        const data = {
            type: typeof value,
            value: value,
            expires: expiresTime
        }

        // 存入localStorage
        try {
            window.localStorage.setItem(cacheName, JSON.stringify(data))
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

        // 获取localStorage中要读取的缓存名
        let cacheName = this.prefix + '-[' + key.toString() + ']'
        try {
            const cacheData = JSON.parse(window.localStorage.getItem(cacheName))
            // 判断缓存是否过期
            if (cacheData.expires < currentTime) {
                return null
            }
            return cacheData.value
        } catch (err) {
            console.error('读取数据失败：' + JSON.stringify(err))
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
            return true
        } catch (err) {
            console.error('清空所有缓存数据失败：' + JSON.stringify(err))
            return false
        }
    }
}

const _this = new Cache()
export default _this
