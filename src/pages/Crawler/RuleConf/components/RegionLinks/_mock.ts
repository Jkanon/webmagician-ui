import { Request, Response } from 'express';
import { addTableList, deleteTableList, editTableList, getTableList } from '@/../mock/utils';
import { RegionLinksItem } from '@/pages/Crawler/RuleConf/models/components/regionLinks';

const tableListDataSource: RegionLinksItem[] = [
  {
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
  {
    id: '913382895263879171',
    name: 'Fans List（粉丝列表页）',
    method: 'GET',
    type: 2,
    selector: '',
    pageRegion: {
      id: '913382675704647681',
      name: '列表',
      selector: '',
    },
  },
];

function get(req: Request, res: Response) {
  const { regionId } = req.query;

  let dataSource = [...tableListDataSource];
  if (regionId) {
    dataSource = dataSource.filter(x => x.pageRegion && x.pageRegion.id === regionId);
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
