/**
 * 对象数组去重
 * @param {array} array 源对象数组
 * @param {string} key 数组中元素的唯一标识
 */
export default (array, key) => {
    const map = new Map();
    return array.filter(item => !map.has(item[key]) && map.set(item[key], item));
}
