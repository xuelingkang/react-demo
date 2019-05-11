import modelEnhance from '@/utils/modelEnhance';
import { register } from '../service';

export default modelEnhance({
  namespace: 'register',

  state: {
    success: false,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const { code } = yield call(register, payload);
      if (code===200) {
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