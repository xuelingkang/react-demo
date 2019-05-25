/**
 * 当condition为true返回component
 * @param {boolean} condition
 * @param {object} component
 */
export default ({condition, component}) => {
    if (condition) {
        return component;
    }
    return null;
}