import { getUrlParams, addTableList, editTableList } from '../../../../mock/utils';
import { SiteListItem } from './model';

// mock tableListDataSource
let tableListDataSource: SiteListItem[] = [
  {
    id: '911527780227661826',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661836',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661820',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661829',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661828',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661827',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661825',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661824',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661823',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661822',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
  {
    id: '911527780227661821',
    homePage: 'https://www.jianshu.com',
    logo: 'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
    name: '简书',
    shortName: '',
    domain: 'www.jianshu.com',
    charset: 'utf8',
    retryTimes: 10,
    cycleRetryTimes: 20,
    defaultCookies: '',
    headers: '',
    userAgent: '',
    sleepTime: 500,
    timeOut: 100,
  },
];

function getSites(
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

function deleteSites(
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

function addSite(
  req: { url: any; body: any },
  res: {
    json: (arg0: { code: number; data: any }) => void;
  },
  u: any,
  b: { body: any },
) {
  return addTableList(req, res, b, tableListDataSource);
}

function editSite(
  req: { url: any; body: any },
  res: {
    json: (arg0: { code: number; data: any }) => void;
  },
  u: any,
  b: { body: any },
) {
  return editTableList(req, res, b, tableListDataSource);
}

export default {
  'GET /api/crawler/sites': getSites,
  'POST /api/crawler/sites': addSite,
  'PUT /api/crawler/sites': editSite,
  'DELETE /api/crawler/sites': deleteSites,
};
