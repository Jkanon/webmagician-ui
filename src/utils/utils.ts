import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

const openWindow = (url: string): boolean => {
  const otherWindow = window.open();
  if (otherWindow != null) {
    otherWindow.opener = null;
    otherWindow.location.href = url;
  }

  return false;
};

const stopPropagation = (e: React.SyntheticEvent<any>) => {
  e.stopPropagation();
  if (e.nativeEvent.stopImmediatePropagation) {
    e.nativeEvent.stopImmediatePropagation();
  }
};

const getPageQuery = () => parse(window.location.href.split('?')[1]);

export { isUrl, openWindow, stopPropagation, getPageQuery };
