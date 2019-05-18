import modelEnhance from '@/utils/modelEnhance';
import menu from '../menu';
import { has, hasOne, hasAll } from '@/utils/authority';

export default modelEnhance({
    namespace: 'global',

    state: {
        menu: [],
        flatMenu: [],
    },

    effects: {
        *getMenu({payload}, {call, put}) {
            const loopMenu = (items, pitem = {}) => {
                let result = [];
                items.forEach(item => {
                    const {oneof, allof, resource} = item;
                    if (resource) {
                        if (!has(resource)) {
                            return;
                        }
                    }
                    if (oneof && oneof.length>0) {
                        if (!hasOne(oneof)) {
                            return;
                        }
                    }
                    if (allof && allof.length>0) {
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
