import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const openWindow = (url: string): boolean => {
  const otherWindow = window.open();
  if (otherWindow != null) {
    otherWindow.opener = null;
    otherWindow.location.href = url;
  }

  return false;
};

export const stopPropagation = (e: React.SyntheticEvent<any>) => {
  e.stopPropagation();
  if (e.nativeEvent.stopImmediatePropagation) {
    e.nativeEvent.stopImmediatePropagation();
  }
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends { path: string }>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};
