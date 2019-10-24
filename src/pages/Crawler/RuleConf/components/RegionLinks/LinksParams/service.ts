import request from '@/utils/request';
import { stringify } from 'qs';
import { TableListParams } from '@/components/Page/TablePage';

import { LinksParamsItem } from '@/pages/Crawler/RuleConf/models/components/linksParams';

export async function query(params: TableListParams) {
  return request(`/api/crawler/regions/links/params?${stringify(params)}`);
}

export async function remove(params: LinksParamsItem) {
  return request(`/api/crawler/regions/links/params?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function add(params: LinksParamsItem) {
  return request('/api/crawler/regions/links/params', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit(params: LinksParamsItem) {
  return request('/api/crawler/regions/links/params', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
