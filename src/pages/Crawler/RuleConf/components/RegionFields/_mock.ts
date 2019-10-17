import { Request, Response } from 'express';
import { RegionFieldsItem } from '@/pages/Crawler/RuleConf/models/components/regionFields';
import { deleteTableList, editTableList, getTableList } from '@/../mock/utils';

const tableListDataSource: RegionFieldsItem[] = [
  {
    id: '913382895263879170',
    name: 'follow',
    alias: '关注',
    selector: '',
    primaryKey: true,
    pageRegion: {
      id: '913382675704647681',
      name: '列表',
      selector: '',
    },
  },
  {
    id: '913382895163879170',
    name: 'fans',
    alias: '粉丝',
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

function edit(req: Request, res: Response) {
  return editTableList(req, res, tableListDataSource);
}

function del(req: Request, res: Response) {
  return deleteTableList(req, res, tableListDataSource);
}

export default {
  'GET /api/crawler/fields': get,
  'PUT /api/crawler/fields': edit,
  'DELETE /api/crawler/fields': del,
};
