/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import { MenuDataItem, BasicLayoutProps as ProLayoutProps, Settings } from '@ant-design/pro-layout';
import GlobalFooter from '@ant-design/pro-layout/lib/GlobalFooter';
import { Icon } from 'antd';
import React, { useEffect, Fragment } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import RouteContext from '@ant-design/pro-layout/es/RouteContext';
import ProLayout from './Components/ProLayout';
import defaultSettings from '../../config/defaultSettings';

import TabsView from './Components/TabsView';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import logo from '../assets/logo.png';
import logoCollapsed from '../assets/logo-collapsed.png';

interface MySettings extends Settings {
  tabsView: boolean;
}

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: MySettings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const footerRender: BasicLayoutProps['footerRender'] = () => (
  <GlobalFooter
    links={[
      {
        key: 'github',
        title: <Icon type="github" />,
        href: 'https://github.com/Jkanon/webmagician-ui',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
    ]}
    copyright={
      <Fragment>
        Copyright <Icon type="copyright" /> 2018 - {new Date().getFullYear()}{' '}
        {defaultSettings.title}
      </Fragment>
    }
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings, collapsed } = props;
  const { tabsView } = settings;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);

  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  return (
    <ProLayout
      logo={collapsed ? logoCollapsed : logo}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      <div style={{ margin: '-24px -24px 0' }}>
        {tabsView ? (
          <RouteContext.Consumer>
            {value => (
              <TabsView {...value}>
                <div className="ant-pro-page-header-wrap-children-content">{children}</div>
              </TabsView>
            )}
          </RouteContext.Consumer>
        ) : (
          <div className="ant-pro-page-header-wrap-children-content">{children}</div>
        )}
      </div>
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
