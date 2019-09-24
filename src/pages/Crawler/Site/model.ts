import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { isEmpty, isNumber } from 'lodash';

import { TableListItem } from '@/components/StandardTable';
import { TableListData } from '@/components/Page/TablePage';

import { query as querySites, removeSites, addSite, editSite } from './service';

export interface SiteListItem extends TableListItem {
  id: string;
  logo: string;
  name: string;
  shortName: string;
  homePage: string;
  domain: string;
  charset: string;
  retryTimes: number;
  cycleRetryTimes: number;
  defaultCookies: string;
  headers: string;
  userAgent: string;
  sleepTime: number;
  timeOut: number;
  loginJudgeExpression?: string;
}

export interface SiteStateType {
  data: TableListData<SiteListItem>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: SiteStateType) => T) => T },
) => void;

export interface SiteModelType {
  namespace: string;
  state: SiteStateType;
  effects: {
    fetch: Effect;
    create: Effect;
    remove: Effect;
    modify: Effect;
  };
  reducers: {
    save: Reducer<SiteStateType>;
    add: Reducer<SiteStateType>;
    edit: Reducer<SiteStateType>;
    del: Reducer<SiteStateType>;
  };
}
const SiteModel: SiteModelType = {
  namespace: 'site',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySites, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *create({ payload }, { call, put }) {
      const response = yield call(addSite, payload);
      yield put({
        type: 'add',
        payload: response.data,
      });
    },
    *modify({ payload }, { call, put }) {
      try {
        const response = yield call(editSite, payload);
        yield put({
          type: 'edit',
          payload: response.data,
        });
      } catch (e) {
        throw e;
      }
    },
    *remove({ payload }, { call, put }) {
      yield call(removeSites, payload);
      yield put({
        type: 'del',
        payload,
      });
    },
  },

  reducers: {
    del(
      state = {
        data: {
          list: [],
          pagination: {},
        },
      },
      action,
    ) {
      const { ids } = action.payload;
      const { list, pagination } = state.data;
      const newList = list.filter(item => ids.indexOf(item.id) === -1);
      if (!isEmpty(pagination) && isNumber(pagination.total)) {
        pagination.total -= list.length - newList.length;
      }
      return {
        ...state,
        data: {
          ...state.data,
          list: newList,
          pagination,
        },
      };
    },

    add(
      state = {
        data: {
          list: [],
          pagination: {},
        },
      },
      action,
    ) {
      const { list, pagination } = state.data;
      const newList = list;
      newList.unshift(action.payload);
      if (!isEmpty(pagination) && isNumber(pagination.total)) {
        pagination.total += 1;
      }
      return {
        ...state,
        data: {
          ...state.data,
          list: newList,
          pagination,
        },
      };
    },

    edit(
      state = {
        data: {
          list: [],
          pagination: {},
        },
      },
      action,
    ) {
      const { list } = state.data;
      const record = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          list: list.map(r => (r.id === record.id ? record : r)),
        },
      };
    },

    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default SiteModel;
