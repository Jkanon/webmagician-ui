import { Request, Response } from 'express';
import { getTableList, addTableList, editTableList, deleteTableList } from '../../../../mock/utils';
import { PageInfoListItem } from './model';

// mock tableListDataSource
const tableListDataSource: PageInfoListItem[] = [
  {
    id: '913382373068836866',
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

function getRuleConf(req: Request, res: Response) {
  const params = req.query;

  let dataSource = [...tableListDataSource];
  if (params.name) {
    dataSource = dataSource.filter(x => x.name.indexOf(params.name) !== -1);
  }

  return getTableList(req, res, dataSource);
}

function addRuleConf(req: Request, res: Response) {
  return addTableList(req, res, tableListDataSource);
}

function editRuleConf(req: Request, res: Response) {
  return editTableList(req, res, tableListDataSource);
}

function deleteRuleConf(req: Request, res: Response) {
  return deleteTableList(req, res, tableListDataSource);
}

function checkUrlRegex(req: Request, res: Response) {
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
