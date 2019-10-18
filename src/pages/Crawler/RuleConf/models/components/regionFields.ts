import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { isNumber } from 'lodash';

import { TableListItem } from '@/components/StandardTable';
import { TableListData } from '@/components/Page/TablePage';
import { PageRegionListItem } from '@/pages/Crawler/RuleConf/components/PageRegion';
import { query, add, edit, remove } from '@/pages/Crawler/RuleConf/components/RegionFields/service';

export interface RegionFieldsItem extends TableListItem {
  id: string;
  parentId: string;
  alias: string;
  name: string;
  selector: string;
  validationSelector?: string;
  type?: string;
  primaryKey?: boolean;
  repeated?: boolean;
  download?: boolean;
  temp?: boolean;
  required?: boolean;
  remarks?: string;
  children?: RegionFieldsItem[];
  pageRegion?: PageRegionListItem;
}

export interface RegionFieldsStateType {
  data: TableListData<RegionFieldsItem>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: RegionFieldsStateType) => T) => T },
) => void;

export interface RegionFieldsModelType {
  namespace: string;
  state: RegionFieldsStateType;
  effects: {
    fetch: Effect;
    create: Effect;
    modify: Effect;
    remove: Effect;
  };
  reducers: {
    del: Reducer<RegionFieldsStateType>;
    save: Reducer<RegionFieldsStateType>;
    add: Reducer<RegionFieldsStateType>;
    edit: Reducer<RegionFieldsStateType>;
  };
}

const RegionFieldsModel: RegionFieldsModelType = {
  namespace: 'regionFields',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *create({ payload }, { call, put }) {
      const response = yield call(add, payload);
      yield put({
        type: 'add',
        payload: response.data,
      });
    },

    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *modify({ payload }, { call, put }) {
      const response = yield call(edit, payload);
      yield put({
        type: 'edit',
        payload: response.data,
      });
    },

    *remove({ payload }, { call, put }) {
      yield call(remove, payload);
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
      const { list, pagination = {} } = state.data;
      const newList = list.filter(item => ids.indexOf(item.id) === -1);
      if (pagination && pagination !== false && isNumber(pagination.total)) {
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
      const { list, pagination = {} } = state.data;
      const newList = list;
      newList.unshift(action.payload);
      if (pagination && pagination !== false && isNumber(pagination.total)) {
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

export default RegionFieldsModel;
