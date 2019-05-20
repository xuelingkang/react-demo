import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import {save, update, del, detail, findAllResources} from '../service';
import {modelNamespace} from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/role/{current}/{size}'),
        allResources: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/role') {
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
            yield put({
                type: 'getAllResources'
            });
        },
        * save({payload}, {call, put}) {
            const {values, success} = payload;
            values.resources = values.resources.map(id => ({id}));
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
            values.resources = values.resources.map(id => ({id}));
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
            const {recordKeys, records, success} = payload;
            const {code} = yield call(del, {ids: recordKeys});
            if (code === 200) {
                success && success();
                yield put({
                    type: 'refresh'
                });
            }
        },
        * detail({payload}, {call}) {
            const {rowKey: id} = payload;
            const {code, data} = yield call(detail, {id});
            if (code === 200) {
                return data;
            }
        },
        * search({payload}, {select, put}) {
            const {pageInfo} = yield select(state => state[modelNamespace]);
            const pageInfo_ = yield pageInfo.search();
            yield put({
                type: '@change',
                payload: {
                    pageInfo: pageInfo_
                }
            });
        },
        * expand({payload}, {call, select, put}) {
            const {pageInfo} = yield select(state => state[modelNamespace]);
            const {id} = payload;
            const {code, data} = yield call(detail, {id});
            if (code===200) {
                const {resources} = data;
                const records = pageInfo.records.map(record => record.id===id? {
                    ...record,
                    resources
                }: record);
                yield put({
                    type: '@change',
                    payload: {
                        pageInfo: {
                            ...pageInfo,
                            records
                        }
                    }
                });
            }
        },
        * refresh({ payload }, { put }) {
            yield put({
                type: 'search'
            });
        },
        * getAllResources({ payload }, { call, put }) {
            const {code, data} = yield call(findAllResources);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        allResources: data
                    }
                });
            }
        }
    },

    reducers: {}
});
