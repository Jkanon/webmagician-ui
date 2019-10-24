import { Request, Response } from 'express';
import { addTableList, deleteTableList, editTableList, getTableList } from '@/../mock/utils';
import { LinksParamsItem } from '@/pages/Crawler/RuleConf/models/components/linksParams';

const tableListDataSource: LinksParamsItem[] = [
  {
    id: '913382672224647681',
    name: 'Article Content（文章详情页）',
    type: 1,
    selector: '',
    parentId: '913382895263879170',
    regionLinks: {
      id: '913382895263879170',
      name: 'Article Content（文章详情页）',
      method: 'GET',
      type: 1,
      selector: '',
      pageRegion: {
        id: '913382675704647681',
        name: '列表',
        selector: '',
      },
    },
  },
];

function get(req: Request, res: Response) {
  const { linkId } = req.query;

  let dataSource = [...tableListDataSource];
  if (linkId) {
    dataSource = dataSource.filter(x => x.regionLinks && x.regionLinks.id === linkId);
  }

  return getTableList(req, res, dataSource);
}

function add(req: Request, res: Response) {
  return addTableList(req, res, tableListDataSource);
}

function edit(req: Request, res: Response) {
  return editTableList(req, res, tableListDataSource);
}

function del(req: Request, res: Response) {
  return deleteTableList(req, res, tableListDataSource);
}

export default {
  'GET /api/crawler/regions/links': get,
  'POST /api/crawler/regions/links': add,
  'PUT /api/crawler/regions/links': edit,
  'DELETE /api/crawler/regions/links': del,
};
