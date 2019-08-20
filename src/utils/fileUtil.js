import $$ from 'cmn-utils';

/**
 * 获取文件后缀名
 * @param {File} file 文件
 * @return {String} 文件后缀名
 */
export const getExt = file => {
    const name = file.name;
    const index = name.lastIndexOf(".");
    if (index!==-1) {
        return name.substring(index+1);
    }
    return '';
};

/**
 * 检查文件后缀名
 * @param {File} file 文件
 * @param {Array|String} accepts 合法后缀
 * @return {Boolean} true 验证通过，false 验证不通过
 */
export const checkExt = (file, accepts) => {
    const ext = getExt(file).toUpperCase();
    if (!$$.isArray(accepts)) {
        accepts = [accepts];
    }
    for (let i=0; i<accepts.length; i++) {
        const accept = accepts[i];
        if (accept.toUpperCase()===ext) {
            return true;
        }
    }
    return false;
}
