import {detail, update} from '../service';
import modelEnhance from "@/utils/modelEnhance"

export default modelEnhance({

    namespace: 'userinfo',

    state: {
        userinfo: {}
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/userinfo') {
                    dispatch({
                        type: 'init'
                    });
                }
            });
        }
    },

    effects: {
        * init({payload}, {put}) {
            yield put({
                type: 'detail'
            });
        },
        * update({payload}, {call, put}) {
            const {code} = yield call(update, payload);
            if (code===200) {
                yield put({
                    type: 'detail'
                });
            }
        },
        * detail({payload}, {call, put}) {
            const {code, data} = yield call(detail);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        userinfo: data
                    }
                });
            }
        }
    },

    reducers: {}
});
