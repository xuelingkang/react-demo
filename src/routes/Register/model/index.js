import modelEnhance from '@/utils/modelEnhance';
import { register } from '../service';
import { cacheAuth } from '@/utils/authentication';

export default modelEnhance({
  namespace: 'register',

  state: {
    success: false,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const { code, data } = yield call(register, payload);
      if (code===200) {
        cacheAuth(data.token, data.authorities);
        yield put({
          type: 'registerHandle',
          payload: true,
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        success: payload
      };
    },
  },
});