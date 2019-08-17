import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import omit from 'object.omit';
import {save, del, detail, saveReply, delReply, pageReply} from '../service';
import { findAllUsers } from '../../User/service';
import {modelNamespace} from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/letter/{current}/{size}'),
        allUsers: [],
        replys: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/letter') {
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
            const {code} = yield call(save, values);
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
        // 保存回复
        * saveReply({payload}, {call, put}) {
            const {values, success} = payload;
            const {code} = yield call(saveReply, values);
            if (code === 200) {
                success && success();
                yield put({
                    type: 'searchReply'
                });
            }
        },
        // 删除回复
        * deleteReply({payload}, {call, put}) {
            const {ids, success} = payload;
            const {code} = yield call(delReply, {ids});
            if (code === 200) {
                success && success();
                yield put({
                    type: 'searchReply'
                });
            }
        },
        // 查询回复列表
        * searchReply({payload}, {call, put}) {
            const {params} = payload;
            const {code, data} = yield call(pageReply, params);
            const {records} = data;
            if (code === 200) {
                yield put({
                    type: '@change',
                    payload: {
                        replys: records
                    }
                });
            }
        },
        * clearReplys({payload}, {put}) {
            yield put({
                type: '@change',
                payload: {
                    replys: []
                }
            });
        },
        // 获取所有用户列表
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
