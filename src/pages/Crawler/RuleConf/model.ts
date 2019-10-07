import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { isEmpty, isNumber, isPlainObject } from 'lodash';

import { TableListItem } from '@/components/StandardTable';
import { TableListData } from '@/components/Page/TablePage';

import { query, add, edit, remove, addPageRegion, editdPageRegion } from './service';
import { PageRegionListItem } from './components/PageRegion';

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
  pageRegions?: PageRegionListItem[];
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
    remove: Effect;

    createPageRegion: Effect;
    modifyPageRegion: Effect;
  };
  reducers: {
    del: Reducer<RuleConfStateType>;
    save: Reducer<RuleConfStateType>;
    add: Reducer<RuleConfStateType>;
    edit: Reducer<RuleConfStateType>;

    addPageRegion: Reducer<RuleConfStateType>;
    editPageRegion: Reducer<RuleConfStateType>;
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

    *createPageRegion({ payload }, { call, put }) {
      const response = yield call(addPageRegion, payload);
      yield put({
        type: 'addPageRegion',
        payload: response.data,
      });
    },

    *modifyPageRegion({ payload }, { call, put }) {
      const response = yield call(editdPageRegion, payload);
      yield put({
        type: 'editPageRegion',
        payload: response.data,
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
      // @ts-ignore
      if (!isEmpty(pagination) && isPlainObject(pagination) && isNumber(pagination.total)) {
        // @ts-ignore
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
      // @ts-ignore
      if (!isEmpty(pagination) && isPlainObject(pagination) && isNumber(pagination.total)) {
        // @ts-ignore
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

    addPageRegion(
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
          list: list.map(r => {
            const { pageRegions } = r;
            return r.id === record.pageInfo.id
              ? {
                  ...r,
                  pageRegions: pageRegions === undefined ? [record] : pageRegions.concat(record),
                }
              : r;
          }),
        },
      };
    },

    editPageRegion(
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
          list: list.map(r => {
            const { pageRegions } = r;
            return r.id === record.pageInfo.id
              ? {
                  ...r,
                  // @ts-ignore
                  pageRegions: pageRegions.map(pr => (pr.id === record.id ? record : pr)),
                }
              : r;
          }),
        },
      };
    },
  },
};

export default RuleConfModel;
