/* global window */

import { router } from 'utils'
import { stringify } from 'qs'
import store from 'store'
import { ROLE_TYPE } from 'utils/constant'
import { queryLayout, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import api from 'api'

const routeList = [
  {
    id: '600',
    name: 'Entity schemas',
    cs: { name: 'Entitní schémata' },
    icon: 'hdd',
    route: '/entity-schemas',
  },
  {
    id: '700',
    name: 'Tests',
    cs: { name: 'Testy' },
    icon: 'experiment',
    route: '/tests',
  },
  {
    id: '800',
    name: 'Test results',
    cs: { name: 'Výsledky testů' },
    icon: 'flag',
    route: '/test-results',
  },
  {
    id: '900',
    name: 'Public REST API',
    cs: { name: 'Veřejné REST API' },
    icon: 'radar-chart',
    route: '/public-rest-api',
  },
];
export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    routeList,
    locationPathname: '',
    locationQuery: {},
    theme: 'dark',
    collapsed: store.get('collapsed') || false,
    notifications: [],
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      const { locationPathname } = yield select(_ => _.app);

      yield put({
        type: 'updateState',
        payload: {
          routeList
        },
      });
/*
      router.push({
        pathname: '/entity-schemas',
      })*/
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
  },
}
