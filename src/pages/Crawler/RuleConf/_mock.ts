import { getUrlParams, addTableList, editTableList } from '../../../../mock/utils';
import { PageInfoListItem } from './model';

// mock tableListDataSource
let tableListDataSource: PageInfoListItem[] = [
  {
    id: 913382373068836866,
    name: 'OSCHINA文章页',
    urlRegex: 'https://www.oschina.net/question/[0-9]+_[0-9]+',
    urlExample: 'https://www.oschina.net/question/2720166_2305295',
    enableJs: false,
    method: 'GET',
    contentType: 'html',
    pageValidationSelector: '',
    remarks: '',
    gmtCreate: 1506660681,
  },
];

export function getRuleConf(
  req: { url: any; body: any },
  res: {
    json: (arg0: { code: number; data: any }) => void;
  },
  u: any,
) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = getUrlParams(url);

  const dataSource = [...tableListDataSource];

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 10);
  }
  const current = parseInt(`${params.currentPage}`, 10) || 1;

  const data = {
    list: dataSource.slice((current - 1) * pageSize, current * pageSize),
    pagination: {
      total: dataSource.length,
      pageSize,
      current,
    },
  };

  const result = {
    code: 0,
    data,
  };

  if (res && res.json) {
    return res.json(result);
  }
  return result;
}

export function addRuleConf(
  req: { url: any; body: any },
  res: {
    json: (arg0: { code: number; data: any }) => void;
  },
  u: any,
  b: { body: any },
) {
  return addTableList(req, res, b, tableListDataSource);
}

export function editRuleConf(
  req: { url: any; body: any },
  res: {
    json: (arg0: { code: number; data: any }) => void;
  },
  u: any,
  b: { body: any },
) {
  return editTableList(req, res, b, tableListDataSource);
}

export function deleteRuleConf(
  req: { url: any; body: any },
  res: {
    json: (arg0: { code: number }) => void;
  },
  u: any,
) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = getUrlParams(url);
  const { ids } = params;
  tableListDataSource = tableListDataSource.filter(item => ids.indexOf(item.id.toString()) === -1);

  const result = {
    code: 0,
  };

  if (res && res.json) {
    return res.json(result);
  }
  return result;
}

export function checkUrlRegex(
  req: { url: any; body: any },
  res: {
    json: (arg0: { code: number; data: any }) => void;
  },
) {
  return res.json({
    code: 0,
    data: true,
  });
}

export default {
  'GET /api/crawler/rules': getRuleConf,
  'POST /api/crawler/rules': addRuleConf,
  'PUT /api/crawler/rules': editRuleConf,
  'DELETE /api/crawler/rules/': deleteRuleConf,
  'GET /api/crawler/rules/url/*/*': checkUrlRegex,
};
