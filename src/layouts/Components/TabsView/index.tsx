import React from 'react';
import pathToRegexp from 'path-to-regexp';
import withRouter from 'umi/withRouter';
import router, { RouteData } from 'umi/router';
import { MenuDataItem } from '@ant-design/pro-layout/es/typings';
import find from 'lodash/find';
import TabsView, { TabView } from './TabsView';

function searchPathIdAndName(childrenPathname: string, originalMenuData: any[]): [string, string] {
  function getPathIdAndName(path: string, menuData: MenuDataItem[], parent: MenuDataItem | null) {
    let result: [string, string];
    menuData.forEach(item => {
      // match prefix iteratively
      if (pathToRegexp(`${item.path}(.*)`).test(path)) {
        if (!parent && item.name) {
          result = [item.path, item.name];
        } else if (parent && !parent.component && item.name) {
          // create new tab if item has name and item's parant route has not component
          result = [item.path, item.name];
        }
        // get children pathIdAndName recursively
        if (item.children) {
          result = getPathIdAndName(path, item.children, item) || result;
        }
      }
    });
    // @ts-ignore
    return result;
  }

  return getPathIdAndName(childrenPathname, originalMenuData, null) || ['404', 'Error'];
}

export interface TabsViewProps {
  proRootPath?: string;
  children: React.ReactChildren;
  menuData: MenuDataItem[];
  location: RouteData;
  title: string;
  fixedHeader?: boolean;
}

function routeTo(targetTab?: TabView) {
  if (targetTab) {
    router.push({
      ...targetTab.location,
    });
  }
}

const TabsViewWrapper = (props: TabsViewProps) => {
  const { children, menuData, location } = props;
  if (location.pathname === '/') {
    return children;
  }
  const [pathId, pathName] = searchPathIdAndName(location.pathname, menuData);

  const afterRemoveTab = (removeKey: string, nextTabKey: string, activedTabs: TabView[]) => {
    const targetTab = find(activedTabs, { key: nextTabKey });
    routeTo(targetTab);
  };

  const handleTabChange = (keyToSwitch: string, activedTabs: TabView[]) => {
    const targetTab = find(activedTabs, { key: keyToSwitch });
    routeTo(targetTab);
  };

  return (
    <TabsView
      activeKey={pathId}
      activeTitle={pathName}
      handleTabChange={handleTabChange}
      afterRemoveTab={afterRemoveTab}
      extraTabProperties={{
        location,
      }}
      {...props}
    >
      {children}
    </TabsView>
  );
};

export default withRouter(TabsViewWrapper as any);
