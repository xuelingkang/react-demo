import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import omit from 'object.omit';
import {save, update, del, detail, send} from '../service';
import { findAllUsers } from '../../User/service';
import {modelNamespace} from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/mail/{current}/{size}'),
        allUsers: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/mail') {
                    dispatch({
                        type: 'init'
                    });
                }
            });
        }
    },

    effects: {
        // 进入页面加载
        * init({payload}, {put}) {
            yield put({
                type: 'refresh'
            });
        },
        * save({payload}, {call, put}) {
            const {values, success} = payload;
            let {mailContent, toUsers, attachments} = values;
            mailContent = {
                content: mailContent
            }
            toUsers = toUsers.map(id => ({id}));
            attachments = attachments.map(({id, response}) => {
                if (id) {
                    return {id};
                } else if (response) {
                    const {code, data} = response;
                    if (code===200) {
                        const {id} = data;
                        return {id};
                    }
                }
            });
            const {code} = yield call(save, {...values, mailContent, toUsers, attachments});
            if (code === 200) {
                success && success();
                yield put({
                    type: 'search'
                });
            }
        },
        * update({payload}, {call, put}) {
            const {values, record, success} = payload;
            const {id, mailContent: {id: mailContentId}} = record;
            let {mailContent, toUsers, attachments} = values;
            mailContent = {
                id: mailContentId,
                content: mailContent
            }
            toUsers = toUsers.map(id => ({id}));
            attachments = attachments.map(({id, response}) => {
                if (id) {
                    return {id};
                } else if (response) {
                    const {code, data} = response;
                    if (code===200) {
                        const {id} = data;
                        return {id};
                    }
                }
            });
            const {code} = yield call(update, {...values, mailContent, toUsers, attachments, id});
            if (code === 200) {
                success && success();
                yield put({
                    type: 'search'
                });
            }
        },
        * delete({payload}, {call, put}) {
            const {recordKeys, success} = payload;
            const {code} = yield call(del, {ids: recordKeys});
            if (code === 200) {
                success && success();
                yield put({
                    type: 'search'
                });
            }
        },
        * detail({payload}, {call, put, select}) {
            const {pageInfo} = yield select(state => state[modelNamespace]);
            const {rowKey: id} = payload;
            const {code, data} = yield call(detail, {id});
            if (code === 200) {
                const records = pageInfo.records.map(item => item.id === id ? {
                    ...item,
                    ...omit(data, 'toUsersInfo'),
                } : item);
                yield put({
                    type: '@change',
                    payload: {
                        pageInfo: {
                            ...pageInfo,
                            records
                        }
                    }
                });
                return records.find(item => item.id === id);
            }
        },
        * send({payload}, {call, put}) {
            const {record} = payload;
            const {id} = record;
            const {code} = yield call(send, {id});
            if (code===200) {
                yield put({
                    type: 'search'
                });
            }
        },
        * search({payload}, {select, put}) {
            const {pageInfo} = yield select(state => state[modelNamespace]);
            const pageInfo_ = yield pageInfo.search();
            yield put({
                type: '@change',
                payload: {
                    pageInfo: pageInfo_,
                }
            });
        },
        // 获取所有部门列表
        * findAllUsers({payload}, {call, put}) {
            const {code, data} = yield call(findAllUsers);
            if (code === 200) {
                yield put({
                    type: '@change',
                    payload: {
                        allUsers: data
                    }
                });
            }
        },
        * refresh({payload}, {put}) {
            yield put({
                type: 'findAllUsers'
            });
            yield put({
                type: 'search'
            });
        }
    },

    reducers: {}
});
