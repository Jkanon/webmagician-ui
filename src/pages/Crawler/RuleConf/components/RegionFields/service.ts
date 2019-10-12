import request from '@/utils/request';
import { stringify } from 'qs';
import { TableListParams } from '@/components/Page/TablePage';

import { RegionFieldsItem } from '@/pages/Crawler/RuleConf/components/RegionFields/model';

export async function query(params: TableListParams) {
  return request(`/api/crawler/rules?${stringify(params)}`);
}

export async function remove(params: RegionFieldsItem) {
  return request(`/api/crawler/fields?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function add(params: RegionFieldsItem) {
  return request('/api/crawler/fields', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit(params: RegionFieldsItem) {
  return request('/api/crawler/fields', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
