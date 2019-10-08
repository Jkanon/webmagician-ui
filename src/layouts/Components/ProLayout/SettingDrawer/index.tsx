import '@ant-design/pro-layout/es/SettingDrawer/index.less';

import { Drawer, Icon, List, Select, Switch, Tooltip } from 'antd';
import React, { Component } from 'react';
import defaultSettings, { Settings } from '@ant-design/pro-layout/es/defaultSettings';

import getLocales, { getLanguage } from '@ant-design/pro-layout/es/locales';
import { isBrowser } from '@ant-design/pro-layout/es/utils/utils';

const { Option } = Select;

type MergerSettingsType<T> = Partial<T> & {
  primaryColor?: string;
  colorWeak?: boolean;
  tabsView?: boolean;
};

interface SettingItemProps {
  title: React.ReactNode;
  action: React.ReactElement;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
}

export interface SettingDrawerProps {
  settings: MergerSettingsType<Settings>;
  collapse?: boolean;
  // for test
  getContainer?: any;
  onCollapseChange?: (collapse: boolean) => void;
  onSettingChange?: (settings: MergerSettingsType<Settings>) => void;
}

export interface SettingDrawerState extends MergerSettingsType<Settings> {
  collapse?: boolean;
  language?: string;
}

class SettingDrawer extends Component<SettingDrawerProps, SettingDrawerState> {
  state: SettingDrawerState = {
    collapse: false,
    language: getLanguage(),
  };

  static getDerivedStateFromProps(props: SettingDrawerProps): SettingDrawerState | null {
    if ('collapse' in props) {
      return {
        collapse: !!props.collapse,
      };
    }
    return null;
  }

  componentDidMount(): void {
    if (isBrowser()) {
      window.addEventListener('languagechange', this.onLanguageChange, {
        passive: true,
      });
    }
  }

  componentWillUnmount(): void {
    if (isBrowser()) {
      window.removeEventListener('languagechange', this.onLanguageChange);
    }
  }

  onLanguageChange = (): void => {
    const language = getLanguage();

    if (language !== this.state.language) {
      this.setState({
        language,
      });
    }
  };

  getLayoutSetting = (): SettingItemProps[] => {
    const { settings } = this.props;
    const formatMessage = this.getFormatMessage();
    const { contentWidth, tabsView, fixedHeader, layout, fixSiderbar } =
      settings || defaultSettings;
    return [
      {
        title: formatMessage({
          id: 'app.setting.content-width',
          defaultMessage: 'Content Width',
        }),
        action: (
          <Select<string>
            value={contentWidth}
            size="small"
            onSelect={value => this.changeSetting('contentWidth', value)}
            style={{ width: 80 }}
          >
            {layout === 'sidemenu' ? null : (
              <Option value="Fixed">
                {formatMessage({
                  id: 'app.setting.content-width.fixed',
                  defaultMessage: 'Fixed',
                })}
              </Option>
            )}
            <Option value="Fluid">
              {formatMessage({
                id: 'app.setting.content-width.fluid',
                defaultMessage: 'Fluid',
              })}
            </Option>
          </Select>
        ),
      },
      {
        title: '多页签导航',
        action: (
          <Switch
            size="small"
            checked={!!tabsView}
            onChange={checked => this.changeSetting('tabsView', checked)}
          />
        ),
      },
      {
        title: formatMessage({
          id: 'app.setting.fixedheader',
          defaultMessage: 'Fixed Header',
        }),
        action: (
          <Switch
            size="small"
            checked={!!fixedHeader}
            onChange={checked => this.changeSetting('fixedHeader', checked)}
          />
        ),
      },
      {
        title: formatMessage({
          id: 'app.setting.fixedsidebar',
          defaultMessage: 'Fixed Sidebar',
        }),
        disabled: layout === 'topmenu',
        disabledReason: formatMessage({
          id: 'app.setting.fixedsidebar.hint',
          defaultMessage: 'Works on Side Menu Layout',
        }),
        action: (
          <Switch
            size="small"
            checked={!!fixSiderbar}
            onChange={checked => this.changeSetting('fixSiderbar', checked)}
          />
        ),
      },
    ];
  };

  changeSetting = (key: string, value: string | boolean) => {
    const { settings } = this.props;
    const nextState = { ...settings };
    nextState[key] = value;
    if (key === 'layout') {
      nextState.contentWidth = value === 'topmenu' ? 'Fixed' : 'Fluid';
    } else if (key === 'fixedHeader' && !value) {
      nextState.autoHideHeader = false;
    }
    this.setState(nextState, () => {
      const { onSettingChange } = this.props;
      if (onSettingChange) {
        onSettingChange(this.state as MergerSettingsType<Settings>);
      }
    });
  };

  togglerContent = () => {
    const { collapse } = this.state;
    const { onCollapseChange } = this.props;
    if (onCollapseChange) {
      onCollapseChange(!collapse);
      return;
    }
    this.setState({ collapse: !collapse });
  };

  renderLayoutSettingItem = (item: SettingItemProps) => {
    const action = React.cloneElement(item.action, {
      disabled: item.disabled,
    });
    return (
      <Tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
        <List.Item actions={[action]}>
          <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
        </List.Item>
      </Tooltip>
    );
  };

  getFormatMessage = (): ((data: { id: string; defaultMessage?: string }) => string) => {
    const formatMessage = ({
      id,
      defaultMessage,
    }: {
      id: string;
      defaultMessage?: string;
    }): string => {
      const locales = getLocales();
      if (locales[id]) {
        return locales[id];
      }
      if (defaultMessage) {
        return defaultMessage as string;
      }
      return id;
    };
    return formatMessage;
  };

  render(): React.ReactNode {
    const { getContainer } = this.props;
    const { collapse } = this.state;
    return (
      <Drawer
        visible={collapse}
        width={300}
        onClose={this.togglerContent}
        placement="right"
        getContainer={getContainer}
        handler={
          <div className="ant-pro-setting-drawer-handle" onClick={this.togglerContent}>
            <Icon
              type={collapse ? 'close' : 'setting'}
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          </div>
        }
        style={{
          zIndex: 9999,
        }}
      >
        <div className="ant-pro-setting-drawer-content">
          <List
            split={false}
            dataSource={this.getLayoutSetting()}
            renderItem={this.renderLayoutSettingItem}
          />
        </div>
      </Drawer>
    );
  }
}

export default SettingDrawer;
