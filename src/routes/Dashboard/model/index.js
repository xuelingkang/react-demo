import modelEnhance from '@/utils/modelEnhance';
import {broadcastMonth, mailMonth, broadcastSendUser, mailSendUser, userSex} from '../service';

export default modelEnhance({
    namespace: 'dashboard',

    state: {
        broadcastMonth: [],
        mailMonth: [],
        broadcastSendUser: [],
        mailSendUser: [],
        userSex: [],
        bar1: [],
        bar2: []
    },

    subscriptions: {
        setup({history, dispatch}) {
            return history.listen(({pathname}) => {
                if (pathname.indexOf('/dashboard') !== -1) {
                    dispatch({
                        type: 'broadcastMonth'
                    });
                    dispatch({
                        type: 'mailMonth'
                    });
                    dispatch({
                        type: 'broadcastSendUser'
                    });
                    dispatch({
                        type: 'mailSendUser'
                    });
                    dispatch({
                        type: 'userSex'
                    });
                }
            });
        }
    },

    effects: {
        * broadcastMonth({payload}, {call, put}) {
            const {code, data} = yield call(broadcastMonth);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        broadcastMonth: data
                    }
                });
            }
        },
        * mailMonth({payload}, {call, put}) {
            const {code, data} = yield call(mailMonth);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        mailMonth: data
                    }
                });
            }
        },
        * broadcastSendUser({payload}, {call, put}) {
            const {code, data} = yield call(broadcastSendUser);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        broadcastSendUser: data
                    }
                });
            }
        },
        * mailSendUser({payload}, {call, put}) {
            const {code, data} = yield call(mailSendUser);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        mailSendUser: data
                    }
                });
            }
        },
        * userSex({payload}, {call, put}) {
            const {code, data} = yield call(userSex);
            if (code===200) {
                yield put({
                    type: '@change',
                    payload: {
                        userSex: data
                    }
                });
            }
        }
    },
});