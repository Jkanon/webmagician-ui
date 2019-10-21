import { Request, Response } from 'express';
import { isEmpty, uniqueId } from 'lodash';
import { RegionFieldsItem } from '@/pages/Crawler/RuleConf/models/components/regionFields';
import { deleteTableList, editTableList, getTableList, response } from '@/../mock/utils';

const tableListDataSource: RegionFieldsItem[] = [
  {
    id: '913382895263879170',
    parentId: '913382675704647681',
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
    parentId: '913382675704647681',
    name: 'fans',
    alias: '粉丝',
    selector: '',
    pageRegion: {
      id: '913382675704647681',
      name: '列表',
      selector: '',
    },
  },
  {
    id: '913382825163879170',
    parentId: '913382675704647681',
    name: 'articles',
    alias: '文章列表',
    selector: '',
    repeated: true,
    pageRegion: {
      id: '913382675704647681',
      name: '列表',
      selector: '',
    },
    children: [
      {
        id: '913382825263879170',
        parentId: '913382825163879170',
        name: 'article_title',
        alias: '标题',
        selector: '',
        pageRegion: {
          id: '913382675704647681',
          name: '列表',
          selector: '',
        },
      },
      {
        id: '923382825263879170',
        parentId: '913382825163879170',
        name: 'article_brief',
        alias: '摘要',
        selector: '',
        pageRegion: {
          id: '913382675704647681',
          name: '列表',
          selector: '',
        },
      },
    ],
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

function addChildren(parentId: string, children?: RegionFieldsItem[]): RegionFieldsItem | false {
  if (children && children.length > 0) {
    for (let i = 0; i < children.length; i += 1) {
      const data = children[i];
      if (data.id === parentId) {
        return data;
      }
    }
  }
  return false;
}

function add(req: Request, res: Response) {
  const { body } = req;
  if (!isEmpty(body)) {
    const { parentId, pageRegion: { id: regionId } } = body;
    body.id = uniqueId().toString();
    if (parentId === regionId) {
      tableListDataSource.unshift(body);
    } else {
      for (let i = 0; i < tableListDataSource.length; i += 1) {
        let data: RegionFieldsItem | false = tableListDataSource[i];
        let match = false;
        if (!(data.pageRegion && data.pageRegion.id === regionId)) {
           data = addChildren(parentId, data.children);
          match = true;
        } else if (data.id === parentId) {
          match = true;
        }

        if (data !== false && match) {
          if (!data.children) {
            data.children = [];
          }
          data.children.unshift(body);
          break;
        }
      }
    }
  }
  return response(res, {
    code: 0,
    data: body,
  });
}

function edit(req: Request, res: Response) {
  return editTableList(req, res, tableListDataSource);
}

function del(req: Request, res: Response) {
  return deleteTableList(req, res, tableListDataSource);
}

export default {
  'GET /api/crawler/fields': get,
  'POST /api/crawler/fields': add,
  'PUT /api/crawler/fields': edit,
  'DELETE /api/crawler/fields': del,
};
