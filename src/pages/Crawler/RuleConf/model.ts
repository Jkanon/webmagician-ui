import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { isEmpty, isNumber } from 'lodash';

import { TableListItem } from '@/components/StandardTable';
import { TableListData } from '@/components/Page/TablePage/index.d';

import { query, add, edit } from './service';

export interface PageInfoListItem extends TableListItem {
  id: string;
  name: string;
  urlRegex: string;
  urlExample?: string;
  enableJs: boolean;
  method: string;
  contentType: string;
  pageParamsExample?: string;
  pageValidationSelector?: string;
  remarks?: string;
  gmtCreate: number;
}

export interface RuleConfStateType {
  data: TableListData<PageInfoListItem>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: RuleConfStateType) => T) => T },
) => void;

export interface RuleConfModelType {
  namespace: string;
  state: RuleConfStateType;
  effects: {
    fetch: Effect;
    create: Effect;
    modify: Effect;
  };
  reducers: {
    save: Reducer<RuleConfStateType>;
    add: Reducer<RuleConfStateType>;
    edit: Reducer<RuleConfStateType>;
  };
}

const RuleConfModel: RuleConfModelType = {
  namespace: 'ruleConf',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *create({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      yield put({
        type: 'add',
        payload: response.data,
      });
      if (callback) callback();
    },

    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *modify({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload);
      yield put({
        type: 'edit',
        payload: response.data,
      });
      if (callback) callback();
    },
  },

  reducers: {
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

export default RuleConfModel;
