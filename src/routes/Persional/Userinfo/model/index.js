import {modpwd} from '../service';
import {cacheAuth, removeAuth} from '@/utils/authentication';
import modelEnhance from "@/utils/modelEnhance"

export default modelEnhance({
    namespace: 'userinfo',

    effects: {
        * modPwd({payload}, {call, put}) {
            const {code} = yield call(modpwd, payload);
            if (code===200) {

            }
        },
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
