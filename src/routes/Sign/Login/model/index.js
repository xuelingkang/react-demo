import {login} from '../service';
import {cacheAuth, removeAuth} from '@/utils/authentication';

export default {
    namespace: 'login',

    state: {
        username: 'admin',
        password: 'admin',
        remember: true,
        code: undefined,
        message: ''
    },

    subscriptions: {
        setup({history, dispatch}) {
            return history.listen(({pathname}) => {
                if (pathname.indexOf('/sign/login') !== -1) {
                    removeAuth();
                }
            });
        }
    },

    effects: {
        *login({payload}, {call, put}) {
            const {code, data, message} = yield call(login, payload);
            if (code === 200) {
                const {token, authorities, user} = data;
                yield put({
                    type: 'loginSuccess',
                    payload: {
                        ...payload,
                        code,
                        token,
                        authorities,
                        user
                    }
                });
            } else {
                yield put({
                    type: 'loginFailure',
                    payload: {
                        ...payload,
                        code,
                        message
                    }
                });
            }
        }
    },

    reducers: {
        loginSuccess(state, {payload}) {
            const {code, username, password, token, authorities, user, remember} = payload;
            cacheAuth(token, authorities, user, remember);
            return {
                ...state,
                code,
                username,
                password,
                remember
            };
        },
        loginFailure(state, {payload}) {
            return {
                ...state,
                ...payload
            }
        }
    }
};
