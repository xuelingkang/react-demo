import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import {getAllCategory, save, update, del, detail} from '../service';
import {modelNamespace} from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/resource/{current}/{size}'),
        allCategorys: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/resource') {
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
                    pageInfo: pageInfo_,
                }
            });
        },
        * getAllCategorys({ payload }, { call, put }) {
            const { code, data } = yield call(getAllCategory);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        allCategorys: data
                    }
                });
            }
        },
        * refresh({ payload }, { put }) {
            yield put({
                type: 'getAllCategorys'
            });
            yield put({
                type: 'search'
            });
        }
    },

    reducers: {}
});
