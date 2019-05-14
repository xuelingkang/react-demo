import { retrievePasswordEmail, retrievePassword } from '../service';

export default {
    namespace: 'retrievePassword',

    state: {
        emailStatus: false,
        modPwdStatus: false
    },

    effects: {
        *email({payload}, {call, put}) {
            const {code} = yield call(retrievePasswordEmail, payload);
            if (code===200) {
                yield put({
                    type: 'emailHandler',
                    payload: {
                        emailStatus: true
                    }
                });
            } else {
                yield put({
                    type: 'emailHandler',
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
                    type: 'modPwdHandler',
                    payload: {
                        emailStatus: true
                    }
                });
            } else {
                yield put({
                    type: 'modPwdHandler',
                    payload: {
                        emailStatus: false
                    }
                });
            }
        }
    },

    reducers: {
        emailHandler(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        modPwdHandler(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        }
    }

};
