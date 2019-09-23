import request from '@/utils/request';
import { stringify } from 'qs';

import { TableListParams } from '@/components/Page/TablePage';
import { SiteListItem } from '@/pages/Crawler/Site/model';

export async function query(params: TableListParams) {
  return request(`/api/crawler/sites?${stringify(params)}`);
}

export async function removeSites(params: SiteListItem) {
  return request(`/api/crawler/sites?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function addSite(params: SiteListItem) {
  return request('/api/crawler/sites', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function editSite(params: SiteListItem) {
  return request('/api/crawler/sites', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
