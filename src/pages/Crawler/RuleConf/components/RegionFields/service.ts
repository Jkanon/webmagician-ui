import request from '@/utils/request';
import { stringify } from 'qs';
import { TableListParams } from '@/components/Page/TablePage';

import { RegionFieldsItem } from '@/pages/Crawler/RuleConf/models/components/regionFields';

export async function query(params: TableListParams) {
  return request(`/api/crawler/regions/fields?${stringify(params)}`);
}

export async function remove(params: RegionFieldsItem) {
  return request(`/api/crawler/regions/fields?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function add(params: RegionFieldsItem) {
  return request('/api/crawler/regions/fields', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit(params: RegionFieldsItem) {
  return request('/api/crawler/regions/fields', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
