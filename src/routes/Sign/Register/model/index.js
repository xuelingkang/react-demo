import modelEnhance from '@/utils/modelEnhance';
import {register} from '../service';
import {cacheAuth, removeAuth} from '@/utils/authentication';

export default modelEnhance({
    namespace: 'register',

    state: {
        username: '',
        password: '',
        confirm: '',
        email: '',
        code: undefined,
        message: ''
    },

    subscriptions: {
        setup({history, dispatch}) {
            return history.listen(({pathname}) => {
                if (pathname.indexOf('/sign/register') !== -1) {
                    removeAuth();
                }
            });
        }
    },

    effects: {
        *submit({payload}, {call, put}) {
            const {code, data, message} = yield call(register, payload);
            if (code === 200) {
                cacheAuth(data.token, data.authorities, data.user, true);
                yield put({
                    type: 'registerSuccess',
                    payload,
                    code
                });
            } else {
                yield put({
                    type: 'registerFailure',
                    payload,
                    code,
                    message
                });
            }
        },
    },

    reducers: {
        registerSuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
        registerFailure(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        }
    },
});