import { parse } from 'url';
import { isEmpty } from 'lodash';

// refers: https://www.sitepoint.com/get-url-parameters-with-javascript/
export function getUrlParams(url: string) {
  return parse(url, true).query;
}

export function addTableList(
  req: { url: any; body: any },
  res: {
    json: (arg0: { code: number; data: any }) => void;
  },
  b: { body: any },
  tableListDataSource: any[],
) {
  const body = (b && b.body) || req.body;
  if (!isEmpty(body)) {
    body.id = tableListDataSource.length + 1;
    tableListDataSource.unshift(body);
  }

  const result = {
    code: 0,
    data: body,
  };

  if (res && res.json) {
    return res.json(result);
  }
  return result;
}

export function editTableList(
  req: { url: any; body: any },
  res: {
    json: (arg0: { code: number; data: any }) => void;
  },
  b: { body: any },
  tableListDataSource: any[],
) {
  let body = (b && b.body) || req.body;
  if (!isEmpty(body) && body.id) {
    tableListDataSource.forEach((r, i) => {
      if (r.id === body.id) {
        body = Object.assign({}, r, body);
        // eslint-disable-next-line no-param-reassign
        tableListDataSource[i] = body;
      }
    });
  }

  const result = {
    code: 0,
    data: body,
  };

  if (res && res.json) {
    return res.json(result);
  }
  return result;
}
