import { Request, Response } from 'express';
import { uniqueId, isEmpty } from 'lodash';
import {
  getTableList,
  addTableList,
  editTableList,
  deleteTableList,
  response,
} from '@/../mock/utils';
import { PageInfoListItem } from './models/ruleConf';

// mock tableListDataSource
const tableListDataSource: PageInfoListItem[] = [
  {
    id: '913382373068836866',
    name: 'User Profile（简书用户首页）',
    urlRegex: 'https://www.jianshu.com/u/[a-zA-Z0-9]+',
    urlExample: 'https://www.jianshu.com/u/53671b43e905',
    enableJs: false,
    method: 'GET',
    contentType: 'html',
    pageValidationSelector: '',
    remarks: '',
    gmtCreate: 1506660681,
    pageRegions: [
      {
        id: '913382675704647681',
        name: 'Record 1（记录1）',
        selector: '',
      },
    ],
  },
  {
    id: '913382373068836867',
    name: 'Article Page（简书文章页）',
    urlRegex: 'https://www.jianshu.com/p/[a-zA-Z0-9]+',
    urlExample: 'https://www.jianshu.com/p/22f70071c5c4',
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

  return getTableList(
    req,
    res,
    dataSource.map(x => {
      const { pageRegions, ...rest } = x;
      if (pageRegions) {
        return {
          ...rest,
          pageRegions: pageRegions.map(pr => ({
            ...pr,
            pageInfo: x,
          })),
        };
      }
      return x;
    }),
  );
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
  const {
    query: { id = '' },
    params: { regex },
  } = req;
  const regexstr = Buffer.from(regex, 'base64').toString();
  const match =
    tableListDataSource.find(x => x.urlRegex === regexstr && (id === '' || id !== x.id)) ===
    undefined;
  return response(res, {
    code: 0,
    data: match,
  });
}

function addPageRegion(req: Request, res: Response) {
  const { body } = req;
  if (!isEmpty(body) && body.pageInfo && body.pageInfo.id) {
    tableListDataSource.forEach((r, i) => {
      if (r.id === body.pageInfo.id) {
        body.id = uniqueId().toString();
        if (typeof tableListDataSource[i].pageRegions === 'undefined') {
          tableListDataSource[i].pageRegions = [];
        }
        // @ts-ignore
        tableListDataSource[i].pageRegions.unshift(body);
      }
    });
  }

  return response(res, { code: 0, data: body });
}

function editPageRegions(req: Request, res: Response) {
  let { body } = req;
  if (!isEmpty(body) && body.id && body.pageInfo && body.pageInfo.id) {
    tableListDataSource.forEach((r, i) => {
      const { pageRegions } = tableListDataSource[i];
      if (r.id === body.pageInfo.id && pageRegions) {
        tableListDataSource[i].pageRegions = pageRegions.map(pr => {
          if (pr.id === body.id) {
            body = Object.assign({}, pr, body);
            return body;
          }
          return pr;
        });
      }
    });
  }

  const result = {
    code: 0,
    data: body,
  };

  return response(res, result);
}

export default {
  'GET /api/crawler/rules': getRuleConf,
  'POST /api/crawler/rules': addRuleConf,
  'PUT /api/crawler/rules': editRuleConf,
  'DELETE /api/crawler/rules/': deleteRuleConf,
  'GET /api/crawler/rules/url/:url/:regex': checkUrlRegex,

  'POST /api/crawler/rules/([0-9]+)/pageRegions': addPageRegion,
  'PUT /api/crawler/rules/([0-9]+)/pageRegions': editPageRegions,
};
