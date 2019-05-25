/**
 * 下载blob到本地
 * @param content
 * @param filename
 */
export default (content, filename) => {
    const blob = new Blob([content]);
    // IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        imatateDownloadByA(window.URL.createObjectURL(blob), filename);
    }
}

/**
 * 通过a标签模拟下载
 * @param href
 * @param filename
 */
const imatateDownloadByA = (href, filename) => {
    const a = document.createElement('a');
    a.download = filename;
    a.style.display = 'none';
    a.href = href;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(href);
}
