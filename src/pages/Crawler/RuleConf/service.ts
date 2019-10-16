import request from '@/utils/request';
import { stringify } from 'qs';

import { TableListParams } from '@/components/Page/TablePage';
import { PageInfoListItem } from '@/pages/Crawler/RuleConf/models/ruleConf';
import { PageRegionListItem } from '@/pages/Crawler/RuleConf/components/PageRegion';

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

export async function checkUrlRegex(urlRegex: string, url: string, id?: string) {
  let u = `/api/crawler/rules/url/${btoa(url)}/${btoa(urlRegex)}`;
  if (id) {
    u += `?id=${id}`;
  }
  return request(u, {
    method: 'GET',
  });
}

export async function addPageRegion(params: PageRegionListItem) {
  return request(`/api/crawler/rules/${params.pageInfo && params.pageInfo.id}/pageRegions`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function editdPageRegion(params: PageRegionListItem) {
  return request(`/api/crawler/rules/${params.pageInfo && params.pageInfo.id}/pageRegions`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
