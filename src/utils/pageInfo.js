import { axiosGet } from '@/utils/axios';

// 分页对象
export default class {

    constructor(url) {
        this.url = url;
    }

    // 后台url
    url = '';

    // 当前页
    current = 1;

    // 每页数量
    size = 10;

    // 总页数
    pages = 0;

    // 总记录数
    total = 0;

    // 当前页记录
    records = [];

    // 查询条件
    params = {};

    jumpPage(current=1, size=10) {
        this.current = current;
        this.size = size;
        return this;
    }

    setParams(params) {
        this.params = params;
        return this;
    }

    async search() {
        if (this.current<1) {
            this.current = 1;
        }
        const { code, data } = await axiosGet(this.url, {
            ...this.params,
            current: this.current,
            size: this.size
        });
        if (code===200) { // 请求成功
            const { current, size, pages, total, records } = data;
            this.current = current;
            this.size = size;
            this.pages = pages;
            this.total = total;
            this.records = records;
        }
        return this;
    }

}
