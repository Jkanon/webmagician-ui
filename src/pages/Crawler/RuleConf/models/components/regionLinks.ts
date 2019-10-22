import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { isNumber } from 'lodash';

import { TableListItem } from '@/components/StandardTable';
import { TableListData } from '@/components/Page/TablePage';
import { PageRegionListItem } from '@/pages/Crawler/RuleConf/components/PageRegion';
import { query, add, edit, remove } from '@/pages/Crawler/RuleConf/components/RegionLinks/service';

export interface RegionLinksItem extends TableListItem {
  id: string;
  name: string;
  selector: string;
  method: string;
  type: number;
  remarks?: string;
  pageRegion?: PageRegionListItem;
}

export interface RegionLinksStateType {
  data: TableListData<RegionLinksItem>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: RegionLinksStateType) => T) => T },
) => void;

export interface RegionLinksModelType {
  namespace: string;
  state: RegionLinksStateType;
  effects: {
    fetch: Effect;
    create: Effect;
    modify: Effect;
    remove: Effect;
  };
  reducers: {
    del: Reducer<RegionLinksStateType>;
    save: Reducer<RegionLinksStateType>;
    add: Reducer<RegionLinksStateType>;
    edit: Reducer<RegionLinksStateType>;
  };
}

const RegionLinksModel: RegionLinksModelType = {
  namespace: 'regionLinks',

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

export default RegionLinksModel;
