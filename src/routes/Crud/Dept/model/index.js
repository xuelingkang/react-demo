import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import {findAllDept, save, update, del, detail} from '../service';
import {modelNamespace} from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/dept/{current}/{size}'),
        allDepts: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/dept') {
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
                    type: 'refresh'
                });
            }
        },
        * update({payload}, {call, put}) {
            const {values, record, success} = payload;
            const {id} = record;
            const {code} = yield call(update, {...values, id});
            if (code === 200) {
                success && success();
                yield put({
                    type: 'refresh'
                });
            }
        },
        * delete({payload}, {call, put}) {
            const {recordKeys, success} = payload;
            const {code} = yield call(del, {ids: recordKeys});
            if (code === 200) {
                success && success();
                yield put({
                    type: 'refresh'
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
                    ...data
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
        // 获取所有部门列表
        * findAllDepts({payload}, {call, put}) {
            const {code, data} = yield call(findAllDept);
            if (code === 200) {
                yield put({
                    type: '@change',
                    payload: {
                        allDepts: data
                    }
                });
            }
        },
        * refresh({payload}, {put}) {
            yield put({
                type: 'findAllDepts'
            });
            yield put({
                type: 'search'
            });
        }
    },

    reducers: {}
});
