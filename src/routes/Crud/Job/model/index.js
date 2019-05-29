import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import {save, update, pause, resume, del, detail} from '../service';
import {detail as tempDetail, findAllJobTemplate} from '../../JobTemplate/service';
import {modelNamespace} from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/job/{current}/{size}'),
        allTemplates: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/job') {
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
        * pause({payload}, {call, put}) {
            const {id, success} = payload;
            const {code} = yield call(pause, {id});
            if (code===200) {
                success && success();
                yield put({
                    type: 'refresh'
                });
            }
        },
        * resume({payload}, {call, put}) {
            const {id, success} = payload;
            const {code} = yield call(resume, {id});
            if (code===200) {
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
        * findAllJobTemplate({payload}, {call, put}) {
            const {code, data} = yield call(findAllJobTemplate);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        allTemplates: data
                    }
                });
            }
        },
        * tempDetail({payload}, {call, put, select}) {
            let {allTemplates} = yield select(state => state[modelNamespace]);
            const {id} = payload;
            const {code, data} = yield call(tempDetail, {id});
            if (code === 200) {
                allTemplates = allTemplates.map(temp => temp.id===id? {
                    ...temp,
                    ...data
                }: temp);
                yield put({
                    type: '@change',
                    payload: {
                        allTemplates
                    }
                });
                return allTemplates.find(temp => temp.id===id);
            }
        },
        * refresh({payload}, {put}) {
            yield put({
                type: 'findAllJobTemplate'
            });
            yield put({
                type: 'search'
            });
        }
    },

    reducers: {}
});
