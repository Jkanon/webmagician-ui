import { parse } from 'url';

/**
 * 鉴于Mock.js不支持拦截fetch发起的ajax，本模块即为Mock.js的补充。
 * 兼容Mock.js以下语法：
 * Mock.setup({timeout: 400})
 * Mock.setup({timeout: '200-400'})
 */
function mockFetch(Mock) {
  if (!Mock || !Mock.mock) {
    throw new Error('Mock.js is required.');
  }
  const tempFetchName = '__mockFetchRawFetch__';
  // 防止重复引入
  if (window[tempFetchName]) {
    return;
  }
  window[tempFetchName] = window.fetch;
  window.fetch = (url, options) => {
    const { method = 'GET' } = options;
    // eslint-disable-next-line no-underscore-dangle
    if (Mock.XHR._settings.debug) {
      console.log(`${method} ${url}`, 'options: ', options);
    }
    const { pathname: path } = parse(url);
    // eslint-disable-next-line no-underscore-dangle,guard-for-in,no-restricted-syntax
    for (const key in Mock._mocked) {
      // eslint-disable-next-line no-underscore-dangle
      const item = Mock._mocked[key];
      const urlMatch =
        (typeof item.rurl === 'string' && path.indexOf(item.rurl) >= 0) ||
        (item.rurl instanceof RegExp && item.rurl.test(path));
      const methodMatch = !item.rtype || item.rtype === method;
      if (urlMatch && methodMatch) {
        // eslint-disable-next-line no-underscore-dangle
        let timeout = Mock.XHR._settings.timeout || '200-400';
        if (typeof timeout === 'string') {
          // eslint-disable-next-line radix
          const temp = timeout.split('-').map(e => parseInt(e));
          timeout = temp[0] + Math.round(Math.random() * (temp[1] - temp[0]));
        }
        Object.assign(options, { url });
        return new Promise(resolve => {
          const resp =
            typeof item.template === 'function'
              ? item.template.call(this, options)
              : Mock.mock(item.template);
          setTimeout(() => {
            const response = {
              text() {
                return Promise.resolve(JSON.stringify(resp));
              },
              json() {
                return Promise.resolve(resp);
              },
              // blob、formData等一系列方法仅仅是为了让fetch不报错，并没有具体实现它
              blob() {
                return Promise.resolve(resp);
              },
              formData() {
                return Promise.resolve(resp);
              },
              arrayBuffer() {
                return Promise.resolve(resp);
              },
            };
            resolve({
              status: 200,
              clone() {
                return this;
              },
              ...response,
            });
            // eslint-disable-next-line no-underscore-dangle
            if (Mock.XHR._settings.debug) {
              // eslint-disable-next-line no-console
              console.log('resp: ', resp);
            }
          }, timeout);
        });
      }
    }
    return window[tempFetchName](url, options);
  };
}

module.exports = mockFetch;
