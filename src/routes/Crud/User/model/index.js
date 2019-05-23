import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import {save, update, del, detail} from '../service';
import {findAllDept} from "../../Dept/service";
import { findAllRoles } from '../../Role/service';
import {modelNamespace} from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/user/{current}/{size}'),
        allDepts: [],
        allRoles: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/user') {
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
                type: 'getAllDepts'
            });
            yield put({
                type: 'getAllRoles'
            });
        },
        * save({payload}, {call, put}) {
            const {values, success} = payload;
            const {birth} = values;
            values.roles = values.roles.map(id => ({id}));
            const {code} = yield call(save, {...values, birth: birth.valueOf()});
            if (code === 200) {
                success && success();
                yield put({
                    type: 'refresh'
                });
            }
        },
        * update({payload}, {call, put}) {
            const {values, record, success} = payload;
            const {birth} = values;
            values.roles = values.roles.map(id => ({id}));
            const {id} = record;
            const {code} = yield call(update, {...values, id, birth: birth.valueOf()});
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
        * detail({ payload }, { call, put, select }) {
            const { pageInfo } = yield select(state => state[modelNamespace]);
            const { rowKey: id } = payload;
            const {code, data} = yield call(detail, {id});
            if (code===200) {
                const records = pageInfo.records.map(item => item.id===id? {
                    ...item,
                    ...data
                }: item);
                yield put({
                    type: '@change',
                    payload: {
                        pageInfo: {
                            ...pageInfo,
                            records
                        }
                    }
                });
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
        * refresh({ payload }, { put }) {
            yield put({
                type: 'search'
            });
        },
        * getAllDepts({ payload }, { call, put }) {
            const {code, data} = yield call(findAllDept);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        allDepts: data
                    }
                });
            }
        },
        * getAllRoles({ payload }, { call, put }) {
            const {code, data} = yield call(findAllRoles);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        allRoles: data
                    }
                });
            }
        }
    },

    reducers: {}
});
