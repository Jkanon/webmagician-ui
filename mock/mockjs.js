import Mock from 'mockjs';

import { resolve } from 'path';

const fs = require('fs');

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

/**
 * @param {string} url
 * @returns {Object}
 */
const param2Obj = url => {
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
};

let mocks = {};

const modulesFiles = [
  require.context('./', true),
  // require.context('../src/pages/', true, /_mock\.[jt]s$/),
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

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
export function mockXHR() {
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

  function XHR2ExpressReqWrap(respond) {
    return options => {
      let result = null;
      if (respond instanceof Function) {
        const { body, type, url } = options;
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url),
        });
      } else {
        result = respond;
      }
      return Mock.mock(result);
    };
  }

  Object.keys(mocks).forEach(i => {
    let url = i;
    let type = 'GET';
    const res = /^(GET|POST|DELETE|PUT) /.exec(i.toUpperCase());
    if (res && res.length === 2) {
      // eslint-disable-next-line prefer-destructuring
      type = res[1];
      url = url.substring(0, type.length + 1);
    }
    Mock.mock(new RegExp(url), type, XHR2ExpressReqWrap(mocks[i]));
  });
}
