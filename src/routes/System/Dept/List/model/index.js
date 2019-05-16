import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import { getAllDept } from '../service';

export default modelEnhance({
    namespace: 'deptlist',

    state: {
        pageInfo: new PageInfo('/dept/{current}/{size}'),
        allDepts: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname }) => {
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
        *init({ payload }, { call, put, select }) {
            yield put({
                type: 'findall'
            });
            const { pageInfo } = yield select(state => state.deptlist);
            yield pageInfo.search();
        },
        // 获取分页数据
        *getPageInfo({ payload }, { call, put, select }) {
            const { pageInfo } = yield select(state => state.deptlist);
            yield pageInfo.search();
        },
        *save({ payload }, { call, put, select }) {
            console.log(payload)
            const {success} = payload;
            success();
        },
        // 获取所有部门列表
        *findall({ payload }, { call, put }) {
            const { code, data } = yield call(getAllDept);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        allDepts: data
                    }
                });
            }
        }
    },

    reducers: {}
});
