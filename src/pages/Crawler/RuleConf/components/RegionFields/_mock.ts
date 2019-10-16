import { Request, Response } from 'express';
import { RegionFieldsItem } from '@/pages/Crawler/RuleConf/models/components/regionFields';
import { deleteTableList, getTableList } from '@/../mock/utils';

const tableListDataSource: RegionFieldsItem[] = [
  {
    id: '913382895263879170',
    alias: '别名',
    pageRegion: {
      id: '913382675704647681',
      name: '列表',
      selector: '',
    },
  },
  {
    id: '913382895163879170',
    alias: '别名1',
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

  return getTableList(
    req,
    res,
    dataSource,
  )
}

function del(req: Request, res: Response) {
  return deleteTableList(req, res, tableListDataSource);
}

export default {
  'GET /api/crawler/fields': get,
  'DELETE /api/crawler/fields': del,
};
