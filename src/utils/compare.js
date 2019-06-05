/**
 * 排序方法
 * @param {string} sortBy 排序字段
 * @param {string} [sort=asc] 升序降序
 * @returns {Function}
 */
export default (sortBy, sort='asc') => {
    return (obj1, obj2) => {
        if (sort==='asc') {
            return obj1[sortBy] - obj2[sortBy];
        } else if (sort==='desc') {
            return obj2[sortBy] - obj1[sortBy];
        }
        throw new Error('sort必须是asc或desc');
    }
}