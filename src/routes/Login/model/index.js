import { routerRedux } from 'dva/router';

import { login } from '../service';
import cache from '@/utils/cache';
import { TOKEN, AUTHORITIES } from '@/utils/cache-keys';

export default {
  namespace: 'login',

  state: {
    username: '',
    password: '',
    remember: false
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf('/sign/login') !== -1) {
          cache.remove(TOKEN);
          cache.remove(AUTHORITIES);
        }
      });
    }
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { code, data, message } = yield call(login, payload);
      if (code === 200) {
        cache.set(TOKEN, data.token);
        cache.set(AUTHORITIES, data.authorities);
        yield put(routerRedux.replace('/'));
      } else {
        yield put({
          type: 'loginError',
          payload: { message }
        });
      }
    },
    *logout(_, { put }) {}
  },

  reducers: {
    loginSuccess(state, { payload }) {
      return {
        ...state,
        loggedIn: true,
        message: '',
        user: payload
      };
    },
    loginError(state, { payload }) {
      return {
        ...state,
        loggedIn: false,
        message: payload.message
      };
    },
  }
};
