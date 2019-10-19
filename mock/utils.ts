import { parse } from 'url';
import { isEmpty, remove, uniqueId, ListIteratee } from 'lodash';
import { Request, Response } from 'express';

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url: string) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    `{"${decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ')}"}`,
  );
}

// refers: https://www.sitepoint.com/get-url-parameters-with-javascript/
export function getUrlParams(url: string) {
  return parse(url, true).query;
}

export function getTableList(req: Request, res: Response, tableListDataSource: any[]) {
  const params = req.query;
  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 10);
  }
  const current = parseInt(`${params.currentPage}`, 10) || 1;

  const data = {
    list: tableListDataSource.slice((current - 1) * pageSize, current * pageSize),
    pagination: {
      total: tableListDataSource.length,
      pageSize,
      current,
    },
  };

  return response(res, {
    code: 0,
    data,
  });
}

export function addTableList(req: Request, res: Response, tableListDataSource: any[]) {
  const { body } = req;
  if (!isEmpty(body)) {
    body.id = uniqueId().toString();
    tableListDataSource.unshift(body);
  }

  return response(res, {
    code: 0,
    data: body,
  });
}

function assemblyEditData(tableListDataSource: any[], index: number, body: any): any {
  const record = tableListDataSource[index];
  let ret = false;
  if (record.id === body.id) {
    ret = Object.assign({}, record, body, record.children ? { children: record.children } : {});
    // eslint-disable-next-line no-param-reassign
    tableListDataSource[index] = ret;
    return ret;
  }
  if (record.children && record.children.length > 0) {
    for (let i = 0; i < record.children.length; i += 1) {
      ret = assemblyEditData(record.children, i, body);
      if (ret) {
        return ret;
      }
    }
  }
  return ret;
}

export function editTableList(req: Request, res: Response, tableListDataSource: any[]) {
  let { body } = req;
  if (!isEmpty(body) && body.id) {
    for (let i = 0; i < tableListDataSource.length; i += 1) {
      const ret = assemblyEditData(tableListDataSource, i, body);
      if (ret) {
        body = ret;
        break;
      }
    }
  }

  return response(res, {
    code: 0,
    data: body,
  });
}

function removeDataIteratively(tableListDataSource: any[], predicate: ListIteratee<any>) {
  const ret = remove(tableListDataSource, predicate);
  for (let i = 0; i < tableListDataSource.length; i += 1) {
    const record = tableListDataSource[i];
    if (record && record.children && record.children.length > 0) {
      const tmp = removeDataIteratively(record.children, predicate);
      if (tmp.length !== 0) {
        ret.push(...tmp);
        if (record.children.length === 0) {
          record.children = undefined;
        }
      }
    }
  }

  return ret;
}

export function deleteTableList(
  req: Request,
  res: Response,
  tableListDataSource: any[],
  predicate?: ListIteratee<any>,
) {
  const { ids } = req.query;
  if (ids && tableListDataSource.length) {
    removeDataIteratively(
      tableListDataSource,
      predicate || (item => ids.indexOf(item.id.toString()) !== -1),
    );
  }

  return response(res, {
    code: 0,
  });
}

export function response(res: Response, result: { code: number; data?: any }) {
  if (res && res.json) {
    return res.json(result);
  }
  return result;
}
