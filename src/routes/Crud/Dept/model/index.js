import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import { getAllDept, save, update, del, detail } from '../service';
import { modelNamespace } from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/dept/{current}/{size}'),
        allDepts: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({pathname}) => {
                if (pathname === '/dept/list') {
                    dispatch({
                        type: 'init'
                    });
                }
            });
        }
    },

    effects: {
        // 进入页面加载
        *init({ payload }, { put }) {
            yield put({
                type: 'refreshPageInfoAndAllDepts'
            });
        },
        *save({ payload }, { call, put }) {
            const { values, success } = payload;
            const { code } = yield call(save, values);
            if (code===200) {
                success && success();
                yield put({
                    type: 'refreshPageInfoAndAllDepts'
                });
            }
        },
        *update({ payload }, { call, put }) {
            const { values, record, success } = payload;
            const { id } = record;
            const { code } = yield call(update, {...values, id});
            if (code===200) {
                success && success();
                yield put({
                    type: 'refreshPageInfoAndAllDepts'
                });
            }
        },
        *delete({ payload }, { call, put }) {
            const { recordKeys, records, success } = payload;
            const { code } = yield call(del, {ids: recordKeys});
            if (code===200) {
                success && success();
                yield put({
                    type: 'refreshPageInfoAndAllDepts'
                });
            }
        },
        *detail({ payload }, { call }) {
            const { rowKey: id } = payload;
            const {code, data} = yield call(detail, {id});
            if (code===200) {
                return data;
            }
        },
        *search({ payload }, { select, put }) {
            const { pageInfo } = yield select(state => state[modelNamespace]);
            yield pageInfo.search();
            yield put({
                type: '@change',
                payload: {
                    pageInfo,
                }
            });
        },
        // 获取所有部门列表
        *findAllDepts({ payload }, { call, put }) {
            const { code, data } = yield call(getAllDept);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        allDepts: data
                    }
                });
            }
        },
        *refreshPageInfoAndAllDepts({ payload }, { put }) {
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
