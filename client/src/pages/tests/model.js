import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { router, pathMatchRegexp } from 'utils'
import { model } from 'utils/model'
import api from "../../services/index";

const DEFAULT_PAGE_INDEX = 1;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_PAGINATION = {
  page: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE
};

export default modelExtend(model, {
  namespace: 'tests',
  state: {
    list: [],
    pagination: {
      page: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0
    },
    modalType: 'create'
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        const { query, pathname } = location;

        if (pathMatchRegexp("/tests", pathname)) {
          dispatch({
            type: 'changePage',
            payload: {
              page: (query || {}).page || DEFAULT_PAGE_INDEX
            }
          })
        }
      });
    },
  },
  effects: {
    * showModal({payload = {}}, {call, put}) {
      debugger
      const {modalType, itemId} = payload;
      let data;
      if (modalType === "create") {
        data = { data: {
          type: "rest",
          httpMethod: "POST",
          soapTemplate: `<?xml version="1.0"?>
  <soap:Envelope
    xmlns:soap="http://www.w3.org/2003/05/soap-envelope/"
  soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">

  <soap:Body>
    <m:GetPrice xmlns:m="https://www.w3schools.com/prices">
      <m:Item>Apples</m:Item>
    </m:GetPrice>
  </soap:Body>

</soap:Envelope>`
        }};
      } else {
        data = yield call(api.testGet, {id: itemId});
        if (!data) {
          throw data
        }
      }
      debugger

      const entitySchemaList = yield call(api.entitySchemaList, {
        pageSize: 9999,
        page: 1,
      });
      debugger

      yield put({
        type: 'updateState',
        payload: {
          entitySchemas: entitySchemaList.data
        },
      })
      yield put({
        type: 'updateState',
        payload: {
          selectedItem: data.data,
          modalType,
          modalVisible: true
        },
      });
    },
    *hideModal({}, {call, put}) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false
        },
      })
    },
    * changeType({payload = {}}, {call, put}) {
      debugger
      const {modalType, itemId} = payload;

      yield put({
        type: 'updateState',
        payload: {
          selectedItem: data.data,
          modalType,
          modalVisible: true
        },
      });
    },
    *delete({payload}, {call, put, select}) {
      const data = yield call(api.testDelete, payload);

      if (data.success) {
        let page;
        yield select(({tests}) => {
          const { pagination } = tests;
          if (tests.list.length > 1) {
            page = pagination.page;
          } else {
            page = Math.min(DEFAULT_PAGE_INDEX, pagination.page - 1);
          }
        });
        yield put({ type: 'changePage',payload: { page } }); // refresh
      } else {
        throw data
      }
    },

    *run({payload}, {call, put, select}) {
      const data = yield call(api.testRun, payload);
      yield put({ type: 'changePage',payload: { page } }); // refresh
    },
    *changePage({payload}, {select, put, call}) {
      let pagination;
      yield select(({tests}) => {
        pagination = tests.pagination;
      });

      let page = (payload || {}).page || pagination.page || DEFAULT_PAGE_INDEX;

      const listData = yield call(api.testList, {
        ...pagination,
        page
      });

      yield put({
        type: 'updateState',
        payload: {
          list: listData.data,
          pagination: {
            ...pagination,
            page,
            total: listData.total
          }
        },
      });
      yield put({
        type: 'updateState',
        payload: {
          selectedItem: null
        }
      });
    },
    *update({payload}, {call, put}) {
      const data = yield call(api.testUpdate, { ...payload });
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false
          }
        });
        yield put({ type: 'changePage' }); // refresh
      } else {
        throw data
      }
    },
    * create({payload}, {call, put}) {
      const data = yield call(api.testCreate,{ ...payload });
      debugger
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false
          }
        });
        yield put({type: 'changePage', payload: { page: DEFAULT_PAGE_INDEX }}); // refresh
      }
    }
  }
});
