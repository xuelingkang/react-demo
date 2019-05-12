import modelEnhance from '@/utils/modelEnhance';
import { register } from '../service';
import cache from "@/utils/cache"
import {AUTHORITIES, TOKEN} from "@/utils/cache-keys"

export default modelEnhance({
  namespace: 'register',

  state: {
    success: false,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const { code, data } = yield call(register, payload);
      if (code===200) {
        cache.set(TOKEN, data.token);
        cache.set(AUTHORITIES, data.authorities);
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