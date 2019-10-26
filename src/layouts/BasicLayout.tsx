/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, { useEffect, useState } from 'react';
import { MenuDataItem, BasicLayoutProps as ProLayoutProps, Settings } from '@ant-design/pro-layout';
import GlobalFooter from '@ant-design/pro-layout/lib/GlobalFooter';
import RouteContext from '@ant-design/pro-layout/es/RouteContext';
import { Icon, Result, Button } from 'antd';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import ProLayout from './Components/ProLayout';
import SettingDrawer from './Components/ProLayout/SettingDrawer';
import TabsView from './Components/TabsView';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.png';
import logoCollapsed from '../assets/logo-collapsed.png';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

interface MySettings extends Settings {
  tabsView: boolean;
}

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
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

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings: defaultSettings, collapsed, location = { pathname: '/' } } = props;
  const [settings, setSettings] = useState<Partial<MySettings>>(defaultSettings);
  const { tabsView, fixedHeader, title } = settings;

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
        <>
          Copyright <Icon type="copyright" /> 2018 - {new Date().getFullYear()} {title}
        </>
      }
    />
  );

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

  // get children authority
  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
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
      footerRender={tabsView && fixedHeader ? false : footerRender}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      <div style={{ position: 'relative' }} className="ant-pro-page-content-wrap">
        {tabsView ? (
          <RouteContext.Consumer>
            {value => (
              <TabsView {...value}>
                <div className="ant-pro-page-content-wrap-children-content">
                  <Authorized authority={authorized!.authority} noMatch={noMatch}>
                    {children}
                  </Authorized>
                </div>
                {
                fixedHeader && footerRender()}
              </TabsView>
            )}
          </RouteContext.Consumer>
        ) : (
          <div className="ant-pro-page-content-wrap-children-content">
            <Authorized authority={authorized!.authority} noMatch={noMatch}>
              {children}
            </Authorized>
          </div>
        )}
      </div>
      <SettingDrawer settings={settings} onSettingChange={setSettings} />
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
