import request from 'umi-request';
import { stringify } from 'qs';

import { TableListParams } from '@/components/Page/TablePage/index.d';

export async function query(params: TableListParams) {
  return request(`/api/crawler/rules?${stringify(params)}`);
}

export async function add(params: TableListParams) {
  return request('/api/crawler/rules', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit(params: TableListParams) {
  return request('/api/crawler/rules', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function checkUrlRegex(urlRegex: string, url: string) {
  return request(`/api/crawler/rules/url/${url}/${urlRegex}`, {
    method: 'GET',
  });
}
