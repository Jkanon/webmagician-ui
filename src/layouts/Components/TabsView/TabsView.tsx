import React from 'react';
import { Tabs } from 'antd';
import { TabsProps } from 'antd/es/tabs';
import findIndex from 'lodash/findIndex';
import { Dropdown, Menu } from 'antd/es';
import { MenuProps } from 'antd/es/menu';
import { FormattedMessage } from 'umi-plugin-react/locale';

function addTab(newTab: TabView, activedTabs: TabView[]) {
  // filter 过滤路由 为 '/' 的 children
  // map 添加第一个 tab 不可删除
  // console.log(activedTabs, newTab);
  return [...activedTabs, newTab]
    .filter(item => item.path !== '/')
    .map((item, index) => ({ ...item, closable: !(activedTabs.length === 0 && index === 0) }));
}

function switchAndUpdateTab(
  activeIndex: number,
  tabName: string,
  extraTabProperties: any,
  children: React.ReactChildren,
  activedTabs: TabView[],
) {
  const { path, content, refresh, ...rest } = activedTabs[activeIndex];
  activedTabs.splice(activeIndex, 1, {
    tab: tabName,
    content: refresh ? content : children,
    ...rest,
    ...extraTabProperties,
  });
  // map 删除后的 activedTabs 长度为 1 时不可删除
  return activedTabs.map(item => (activedTabs.length === 1 ? { ...item, closable: false } : item));
}

// tabs 菜单选项 key 值
const closeCurrentTabMenuKey = 'closeCurrent';
const closeOthersTabMenuKey = 'closeOthers';

export interface TabView {
  /** tab's title */
  tab: string;
  key: string;
  content: React.ReactChildren;
  /** used to extends tab's properties */
  [k: string]: any;
}

export interface TabsViewProps {
  activeKey: string;
  activeTitle: string;
  handleTabChange: (keyToSwitch: string, activedTabs: any[]) => void;
  extraTabProperties?: {};
  tabsConfig?: TabsProps;
  afterRemoveTab?: (removeKey: string, nextTabKey?: string, activedTabs: TabView[]) => void;
  /** children is used to create tab, switch and update tab */
  children: React.ReactChildren;
}

interface TabsViewState {
  activedTabs: TabView[];
  activeKey?: string;
  nextTabKey?: string;
}

const renderTabBar = (props: TabsProps, DefaultTabBar: React.ComponentClass<any>) => (
  <div style={{ padding: '0 20px', background: '#fff', borderBottom: '1px solid #ccc' }}>
    <DefaultTabBar {...props} />
  </div>
);

class TabsView extends React.Component<TabsViewProps, TabsViewState> {
  static getDerivedStateFromProps(props: TabsViewProps, state: TabsViewState) {
    const { children, activeKey, activeTitle, extraTabProperties } = props;
    const { activedTabs, nextTabKey } = state;
    // return state and set nextTabKey to `null` after delete tab
    if (nextTabKey) {
      return {
        activedTabs,
        activeKey: nextTabKey,
        nextTabKey: null,
      };
    }

    const activedTabIndex = findIndex(activedTabs, { key: activeKey });
    // return state after switch or update tab
    // already opened
    if (activedTabIndex > -1) {
      return {
        activedTabs: switchAndUpdateTab(
          activedTabIndex,
          activeTitle,
          extraTabProperties,
          children,
          activedTabs,
        ),
        activeKey,
      };
    }
    // return state to add new tab when it's not found
    const newTab = {
      tab: activeTitle,
      key: activeKey,
      content: children,
      ...extraTabProperties,
    };
    return {
      activedTabs: addTab(newTab, activedTabs),
      activeKey,
    };
  }

  state = {
    activedTabs: [],
    activeKey: undefined,
    nextTabKey: undefined,
  };

  handleTabsMenuClick = (tabKey: string): MenuProps['onClick'] => event => {
    const { key } = event;
    const { activedTabs } = this.state;

    if (key === closeCurrentTabMenuKey) {
      this.remove(tabKey);
    } else if (key === closeOthersTabMenuKey) {
      // @ts-ignore
      const currentTab = activedTabs.filter(item => item.key === tabKey);
      this.setState({
        // @ts-ignore
        activedTabs: currentTab.map(item => ({ ...item, closable: false })),
      });
    }
  };

  handleTabSwitch = (keyToSwitch: string) => {
    const { handleTabChange } = this.props;
    const { activedTabs } = this.state;
    if (typeof handleTabChange === 'function') {
      handleTabChange(keyToSwitch, activedTabs);
    }
  };

  handleTabEdit = (targetKey: string | React.MouseEvent<HTMLElement>, action: string) => {
    this[action](targetKey);
  };

  remove = (key: string) => {
    const { afterRemoveTab } = this.props;
    const { activedTabs, activeKey } = this.state;
    if (key !== activeKey) {
      this.setState(
        {
          // @ts-ignore
          activedTabs: activedTabs.filter(item => item.key !== key),
          nextTabKey: activeKey,
        },
        () => {
          if (typeof afterRemoveTab === 'function') {
            afterRemoveTab(key, activeKey, activedTabs);
          }
        },
      );
      return;
    }

    const targetIndex = findIndex(activedTabs, { key });
    const nextIndex = targetIndex > 0 ? targetIndex - 1 : targetIndex + 1;
    const nextTabKey = activedTabs[nextIndex].key;

    this.setState(
      {
        activedTabs: activedTabs.filter(item => item.key !== key),
        nextTabKey,
      },
      () => {
        if (typeof afterRemoveTab === 'function') {
          afterRemoveTab(key, nextTabKey, activedTabs);
        }
      },
    );
  };

  render() {
    const { activedTabs, activeKey } = this.state;

    const setMenu = (key: string) => (
      <Menu onClick={this.handleTabsMenuClick(key)}>
        <Menu.Item disabled={activedTabs.length === 1} key={closeCurrentTabMenuKey}>
          <FormattedMessage id="component.tabsView.context.close-current" />
        </Menu.Item>
        <Menu.Item disabled={activedTabs.length === 1} key={closeOthersTabMenuKey}>
          <FormattedMessage id="component.tabsView.context.close-others" />
        </Menu.Item>
      </Menu>
    );

    const setTab = (tab: string, key: string) => (
      <span onContextMenu={event => event.preventDefault()}>
        <Dropdown overlay={setMenu(key)} trigger={['contextMenu']}>
          <span>
            <FormattedMessage id={'menu.'.concat(tab)} />
          </span>
        </Dropdown>
      </span>
    );

    return (
      <Tabs
        className="ant-pro-page-header-wrap-tabs"
        type="editable-card"
        activeKey={activeKey}
        tabBarStyle={{ borderBottom: 0, margin: '0 0 10px 0' }}
        tabBarGutter={0}
        hideAdd
        renderTabBar={renderTabBar}
        onChange={this.handleTabSwitch}
        onEdit={this.handleTabEdit}
      >
        {activedTabs && activedTabs.length
          ? activedTabs.map((item: TabView) => (
              <Tabs.TabPane tab={setTab(item.tab, item.key)} key={item.key}>
                {item.content}
              </Tabs.TabPane>
            ))
          : null}
      </Tabs>
    );
  }
}

export default TabsView;
