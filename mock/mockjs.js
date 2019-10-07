import Mock from 'mockjs';

import pathToRegexp from 'path-to-regexp';
import { resolve } from 'path';
import fs from 'fs';

import mockFetch from './mockjs-fetch';

import { param2Obj } from './utils';

if (typeof require.context === 'undefined') {
  require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.[jt]s$/) => {
    const files = {};

    function readDirectory(directory) {
      fs.readdirSync(directory).forEach(file => {
        const fullPath = resolve(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) readDirectory(fullPath);
          return;
        }

        if (!regularExpression.test(fullPath)) return;

        files[fullPath] = true;
      });
    }

    readDirectory(resolve(__dirname, base));

    function Module(file) {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      return require(file);
    }

    Module.keys = () => Object.keys(files);

    return Module;
  };
}

let mocks = {};

const modulesFiles = [
  require.context('./', true),
  require.context('../src/pages/', true, /_mock\.[jt]s$/),
];
const tmp = [];
modulesFiles.forEach(x => {
  // eslint-disable-next-line array-callback-return
  x.keys().reduce((modules, modulePath) => {
    const m = modulePath.replace(/\.[jt]s/g, '');
    if (!tmp.includes(m)) {
      const value = x(modulePath);
      if (value.default !== undefined) {
        mocks = Object.assign(mocks, value.default);
      }
      tmp.push(m);
    }
  }, {});
});

function decodeParam(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }
  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param ' ${val} '`;
      err.status = 400;
      err.statusCode = 400;
    }
    throw err;
  }
}

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
export function mockXHR() {
  mockFetch(Mock);
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
  Mock.XHR.prototype.send = () => {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false;

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType;
      }
    }
    // eslint-disable-next-line prefer-rest-params
    this.proxy_send(...arguments);
  };

  function XHR2ExpressReqWrap(respond, re, keys) {
    return options => {
      let result = null;
      if (respond instanceof Function) {
        const { body = '{}', method, url } = options;
        const params = {};
        if (keys && keys.length > 0) {
          const match = re.exec(url);
          if (match) {
            for (let i = 1; i < match.length; i += 1) {
              const key = keys[i - 1];
              const prop = key.name;
              const val = decodeParam(match[i]);
              if (val !== undefined || !hasOwnProperty.call(params, prop)) {
                params[prop] = val;
              }
            }
          }
        }
        // https://expressjs.com/en/4x/api.html#req
        result = respond(
          {
            url,
            method,
            body: JSON.parse(body),
            query: param2Obj(url),
            params,
          },
          undefined,
          url,
          {
            body: JSON.parse(body),
          },
        );
      } else {
        result = respond;
      }
      return Mock.mock(result);
    };
  }

  Object.keys(mocks).forEach(i => {
    let url = i;
    let method = 'GET';
    const res = /^(GET|POST|DELETE|PUT) /.exec(i.toUpperCase());
    if (res && res.length === 2) {
      // eslint-disable-next-line prefer-destructuring
      method = res[1];
      url = url.substring(method.length + 1);
    }

    const keys = [];
    const re = pathToRegexp(url, keys);
    Mock.mock(re, method, XHR2ExpressReqWrap(mocks[i], re, keys));
  });
}
