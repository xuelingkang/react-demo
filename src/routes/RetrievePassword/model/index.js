import { retrievePasswordEmail, retrievePassword } from '../service';
import {removeAuth} from "@/utils/authentication"

export default {
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
                        type: 'initRetrievePassword',
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
                        modPwdStatus: true
                    }
                });
            } else {
                yield put({
                    type: 'modPwdHandler',
                    payload: {
                        modPwdStatus: false
                    }
                });
            }
        }
    },

    reducers: {
        initRetrievePassword(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
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
