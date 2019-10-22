import { Request, Response } from 'express';
import { addTableList, editTableList, getTableList, deleteTableList } from '../../../../mock/utils';
import { SiteListItem } from './model';

// mock tableListDataSource
const tableListDataSource: SiteListItem[] = [
  {
    id: '911527780227661826',
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    loginJudgeExpression: "$.css('span')",
  },
  {
    id: '911527780227661836',
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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
    homePage: 'https://www.jianshu.com/u/53671b43e905',
    logo: 'https://favicons.githubusercontent.com/jianshu.com',
    name: 'Jianshu（简书）',
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

function getSites(req: Request, res: Response) {
  const params = req.query;

  let dataSource = [...tableListDataSource];
  if (params.name) {
    dataSource = dataSource.filter(x => x.name.indexOf(params.name) !== -1);
  }

  return getTableList(req, res, dataSource);
}

function deleteSites(req: Request, res: Response) {
  return deleteTableList(req, res, tableListDataSource);
}

function addSite(req: Request, res: Response) {
  return addTableList(req, res, tableListDataSource);
}

function editSite(req: Request, res: Response) {
  return editTableList(req, res, tableListDataSource);
}

export default {
  'GET /api/crawler/sites': getSites,
  'POST /api/crawler/sites': addSite,
  'PUT /api/crawler/sites': editSite,
  'DELETE /api/crawler/sites': deleteSites,
};
