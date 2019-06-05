import modelEnhance from '@/utils/modelEnhance';
import menu from '../menu';
import omit from 'object.omit';
import {has, hasOne, hasAll} from '@/utils/authority';
import {axiosGet, axiosPut, axiosPatch} from '@/utils/axios';
import compare from '@/utils/compare';

export default modelEnhance({
    namespace: 'global',

    state: {
        menu: [],
        flatMenu: [],
        userinfo: {},
        structure: [],
        broadcasts: [],
        chats: [],
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
                        userinfo: data
                    }
                });
            }
        },
        * getStructure({payload}, {put}) {
            const {code, data} = yield axiosGet('/dept/structure');
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        structure: data
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
        },
        * findUnreadBroadcasts({payload}, {put}) {
            const {code, data} = yield axiosGet('/broadcast/self/unread');
            if (code===200) {
                yield put({
                    type: 'addBroadcasts',
                    payload: {
                        data
                    }
                });
            }
        },
        * findUnreadChats({payload}, {put}) {
            const {code, data} = yield axiosGet('/chat/self/unread');
            if (code===200) {
                yield put({
                    type: 'addChats',
                    payload: {
                        data
                    }
                });
            }
        },
        * addBroadcasts({payload}, {put, select}) {
            const {data} = payload;
            if (!data || !data.length) {
                return;
            }
            const {broadcasts} = yield select(({global}) => global);
            yield put({
                type: '@change',
                payload: {
                    broadcasts: broadcasts.concat(data).sort(compare('sendTime', 'desc'))
                }
            });
        },
        * addChats({payload}, {put, select}) {
            const {data} = payload;
            if (!data || !data.length) {
                return;
            }
            let {chats} = yield select(({global}) => global);
            data.forEach(newdata => {
                const {sendUserId, sendUser} = newdata;
                let chat = chats.find(({sendUserId: sendUserId_}) => sendUserId_===sendUserId);
                if (chat) {
                    const {sendUser, messages} = chat;
                    chat = {
                        ...chat,
                        messages: messages.concat(newdata).sort(compare('sendTime', 'desc'))
                    };
                    chats = chats.map(item => {
                        const {sendUserId: sendUserId_} = item;
                        if (sendUserId_===sendUserId) {
                            return chat;
                        }
                        return item;
                    });
                } else {
                    chat = {
                        sendUserId,
                        sendUser,
                        messages: [newdata]
                    };
                    chats = chats.concat(chat);
                }
            });
            yield put({
                type: '@change',
                payload: {
                    chats
                }
            });
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
