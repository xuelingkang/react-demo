import modelEnhance from '@/utils/modelEnhance';
import menu from '../menu';
import omit from 'object.omit';
import {has, hasOne, hasAll} from '@/utils/authority';
import {axiosGet, axiosPut, axiosPatch} from '@/utils/axios';

export default modelEnhance({
    namespace: 'global',

    state: {
        menu: [],
        flatMenu: [],
        userinfo: undefined,
        message: ''
    },

    effects: {
        * getMenu({payload}, {put}) {
            const loopMenu = (items, pitem = {}) => {
                let result = [];
                items.forEach(item => {
                    const {oneof, allof, resource} = item;
                    if (resource) {
                        if (!has(resource)) {
                            return;
                        }
                    }
                    if (oneof && oneof.length > 0) {
                        if (!hasOne(oneof)) {
                            return;
                        }
                    }
                    if (allof && allof.length > 0) {
                        if (!hasAll(allof)) {
                            return;
                        }
                    }
                    if (pitem.path) {
                        item.parentPath = pitem.parentPath ? pitem.parentPath.concat(pitem.path) : [pitem.path];
                    }
                    if (item.children && item.children.length) {
                        result.concat(loopMenu(item.children, item));
                    }
                    result.push(item);
                });
                return result;
            }

            yield put({
                type: 'getMenuSuccess',
                payload: loopMenu(menu),
            });
        },
        * getUserinfo({payload}, {put}) {
            const {code, data} = yield axiosGet('/userinfo');
            if (code === 200) {
                yield put({
                    type: '@change',
                    payload: {
                        userinfo: data,
                        message: '修改个人信息成功'
                    }
                });
            }
        },
        * updateUserinfo({payload}, {put}) {
            const {values, success} = payload;
            const {birth, headImg} = values;
            const params = omit({
                ...values,
                birth: birth.valueOf(),
                headImgId: headImg.id
            }, ['headImg']);
            const {code} = yield axiosPut('/userinfo', params);
            if (code === 200) {
                success && success();
                yield put({
                    type: 'getUserinfo'
                });
            }
        },
        * modpwd({payload}) {
            const {values, success} = payload;
            const {code} = yield axiosPatch('/userinfo', values);
            if (code === 200) {
                success && success();
            }
        }
    },

    reducers: {
        getMenuSuccess(state, {payload}) {
            return {
                ...state,
                menu: payload,
                flatMenu: getFlatMenu(payload),
            };
        }
    },
});

export function getFlatMenu(menus) {
    let menu = [];
    menus.forEach(item => {
        if (item.children) {
            menu = menu.concat(getFlatMenu(item.children));
        }
        menu.push(item);
    });
    return menu;
}
