/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import router from 'umi/router';
import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }) => {
  const { response } = error;
  let message;
  let description;
  if (response && response.status) {
    const { status, url } = response;

    // if (status === 401) {
    //   notification.error({
    //     message: '未登录或登录已过期，请重新登录。',
    //   });
    //   // eslint-disable-next-line no-underscore-dangle
    //   window.g_app._store.dispatch({
    //     type: 'login/logout',
    //   });
    //   return;
    // }

    if (status === 403) {
      router.push('/exception/403');
      return;
    }
    if (status <= 504 && status >= 500) {
      router.push('/exception/500');
      return;
    }
    if (status >= 404 && status < 422) {
      router.push('/exception/404');
      return;
    }

    const errorText = codeMessage[status] || response.statusText;
    message = `请求错误 ${status}: ${url}`;
    description = errorText;
  } else if (!response) {
    if (error instanceof Error) {
      message = `请求错误 ${error.message}`;
    } else {
      description = '您的网络发生异常，无法连接服务器';
      message = '网络异常';
    }
  }
  notification.error({
    message,
    description,
  });
  throw new Error(message);
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// response interceptor, handling response
request.interceptors.response.use(response =>
  response
    .clone()
    .json()
    .then(data => {
      if (data && typeof data.code !== 'undefined') {
        if (data.code !== 0) {
          return Promise.reject(new Error(data.code));
        }
      }
      return response;
    }),
);

export default request;
