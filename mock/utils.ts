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

export function editTableList(req: Request, res: Response, tableListDataSource: any[]) {
  let { body } = req;
  if (!isEmpty(body) && body.id) {
    tableListDataSource.forEach((r, i) => {
      if (r.id === body.id) {
        body = Object.assign({}, r, body);
        // eslint-disable-next-line no-param-reassign
        tableListDataSource[i] = body;
      }
    });
  }

  return response(res, {
    code: 0,
    data: body,
  });
}

export function deleteTableList(
  req: Request,
  res: Response,
  tableListDataSource: any[],
  predicate?: ListIteratee<any>,
) {
  const { ids } = req.query;
  if (ids) {
    if (predicate) {
      remove(tableListDataSource, predicate);
    } else {
      remove(tableListDataSource, item => ids.indexOf(item.id.toString()) !== -1);
    }
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
