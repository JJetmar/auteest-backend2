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
  namespace: 'entitySchema',
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
        if (pathMatchRegexp("/entity-schemas", pathname)) {
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
      const {modalType, itemId} = payload;
      let data;
      if (modalType === "create") {
        data = { data: { attributes: []}};
      } else {
        data = yield call(api.entitySchemaGet, {id: itemId});
        if (!data) {
          throw data
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          selectedItem: data.data,
          modalType,
          modalVisible: true
        },
      });
    },
    * hideModal({}, {call, put}) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false
        },
      })
    },
    *delete({payload}, {call, put, select}) {
      const data = yield call(api.entitySchemaDelete, payload);

      if (data.success) {
        let page;
        yield select(({entitySchema}) => {


        });
        yield put({ type: 'changePage',payload: { page } }); // refresh
      } else {
        throw data
      }
    },
    *changePage({payload}, {select, put, call}) {
      let pagination;
      yield select((a) => {
        pagination = a.entitySchema.pagination;
      });

      let page = (payload || {}).page || pagination.page || DEFAULT_PAGE_INDEX;

      const listData = yield call(api.entitySchemaList, {
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
    },
    *update({payload}, {call, put}) {
      const data = yield call(api.entitySchemaUpdate, { attributes: [], ...payload });
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
      const data = yield call(api.entitySchemaCreate,{ attributes: [], ...payload });
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false
          }
        });
        yield put({type: 'changePage', payload: { page: DEFAULT_PAGE_INDEX }}); // refresh
      }
    },
    *updateAttribute({payload}, {call, put}) {
      let newTree;
      yield select(({entitySchema}) => {
        const { selectedItem } = entitySchema;
        newTree = selectedItem.attributes.filter(attribute => attribute.pseudoId === payload.pseudoId).map(() => payload);
      });
      yield put({
        type: 'updateState',
        payload: {
          selectedItem: newTree
        }
      });
    },
    *updateTree({payload}, {call, put}) {
      let newTree = payload;

      yield put({
        type: 'updateState',
        payload: {
          selectedItem: newTree
        }
      });
    }
  }
});
