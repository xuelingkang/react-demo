import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import {update, detail} from '../service';
import {findAllUsers} from '../../User/service';
import {modelNamespace} from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/broadcast/self/{current}/{size}'),
        allUsers: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/broadcastSelf') {
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
        * update() {
            const {recordKeys, success} = payload;
            const {code} = yield call(update, {ids: recordKeys});
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
