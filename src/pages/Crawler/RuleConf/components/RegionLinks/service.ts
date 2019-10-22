import request from '@/utils/request';
import { stringify } from 'qs';
import { TableListParams } from '@/components/Page/TablePage';

import { RegionLinksItem } from '@/pages/Crawler/RuleConf/models/components/regionLinks';

export async function query(params: TableListParams) {
  return request(`/api/crawler/regions/links?${stringify(params)}`);
}

export async function remove(params: RegionLinksItem) {
  return request(`/api/crawler/regions/links?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function add(params: RegionLinksItem) {
  return request('/api/crawler/regions/links', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit(params: RegionLinksItem) {
  return request('/api/crawler/regions/links', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
