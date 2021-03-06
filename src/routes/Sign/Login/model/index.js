import {login} from '../service';
import {cacheAuth, removeAuth} from '@/utils/authentication';
import modelEnhance from "@/utils/modelEnhance"
import Socket from "@/utils/socket"

export default modelEnhance({
    namespace: 'login',

    state: {
        username: '',
        password: '',
        remember: true,
        code: undefined,
        message: ''
    },

    subscriptions: {
        setup({history, dispatch}) {
            return history.listen(({pathname}) => {
                if (pathname.indexOf('/sign/login') !== -1) {
                    Socket.disconnect();
                    removeAuth();
                }
            });
        }
    },

    effects: {
        *login({payload}, {call, put, select}) {
            const {code, data, message} = yield call(login, payload);
            const { remember } = yield select(state => state.login);
            if (code === 200) {
                const {token, authorities, user} = data;
                cacheAuth(token, authorities, user, remember);
                yield put({
                    type: '@change',
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
                    type: '@change',
                    payload: {
                        ...payload,
                        code,
                        message
                    }
                });
            }
        }
    },

    reducers: {}
});
