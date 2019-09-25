import request from '@/utils/request';
import { stringify } from 'qs';

import { TableListParams } from '@/components/Page/TablePage';
import { PageInfoListItem } from '@/pages/Crawler/RuleConf/model';

export async function query(params: TableListParams) {
  return request(`/api/crawler/rules?${stringify(params)}`);
}

export async function remove(params: PageInfoListItem) {
  return request(`/api/crawler/rules?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function add(params: PageInfoListItem) {
  return request('/api/crawler/rules', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit(params: PageInfoListItem) {
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
