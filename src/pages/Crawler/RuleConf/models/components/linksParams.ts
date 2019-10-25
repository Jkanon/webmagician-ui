import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { isNumber } from 'lodash';

import { TableListItem } from '@/components/StandardTable';
import { RegionLinksItem } from '@/pages/Crawler/RuleConf/models/components/regionLinks';
import { TableListData } from '@/components/Page/TablePage';
import {
  add,
  edit,
  query,
  remove,
} from '@/pages/Crawler/RuleConf/components/RegionLinks/LinksParams/service';

export interface LinksParamsItem extends TableListItem {
  id: string;
  type: number;
  parentId: string;
  selector: string;
  name: string;
  children?: LinksParamsItem[];
  regionLinks: RegionLinksItem;
}

export interface LinksParamsStateType {
  data: TableListData<LinksParamsItem>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: LinksParamsStateType) => T) => T },
) => void;

export interface RegionLinksModelType {
  namespace: string;
  state: LinksParamsStateType;
  effects: {
    fetch: Effect;
    create: Effect;
    modify: Effect;
    remove: Effect;
  };
  reducers: {
    del: Reducer<LinksParamsStateType>;
    save: Reducer<LinksParamsStateType>;
    add: Reducer<LinksParamsStateType>;
    edit: Reducer<LinksParamsStateType>;
  };
}

const LinksParamsModel: RegionLinksModelType = {
  namespace: 'linksParams',

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

export default LinksParamsModel;
