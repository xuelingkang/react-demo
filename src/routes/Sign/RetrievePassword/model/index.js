import { retrievePasswordEmail, retrievePassword } from '../service';
import modelEnhance from "@/utils/modelEnhance"

export default modelEnhance({
    namespace: 'retrievePassword',

    state: {
        emailStatus: false,
        modPwdStatus: false
    },

    subscriptions: {
        setup({history, dispatch}) {
            return history.listen(({pathname}) => {
                if (pathname.indexOf('/sign/retrievePassword') !== -1) {
                    dispatch({
                        type: '@change',
                        payload: {
                            emailStatus: false,
                            modPwdStatus: false
                        }
                    });
                }
            });
        }
    },

    effects: {
        *email({payload}, {call, put}) {
            const {code} = yield call(retrievePasswordEmail, payload);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        emailStatus: true
                    }
                });
            } else {
                yield put({
                    type: '@change',
                    payload: {
                        emailStatus: false
                    }
                });
            }
        },
        *modPwd({payload}, {call, put}) {
            const {code} = yield call(retrievePassword, payload);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        modPwdStatus: true
                    }
                });
            } else {
                yield put({
                    type: '@change',
                    payload: {
                        modPwdStatus: false
                    }
                });
            }
        }
    },

    reducers: {}

});
