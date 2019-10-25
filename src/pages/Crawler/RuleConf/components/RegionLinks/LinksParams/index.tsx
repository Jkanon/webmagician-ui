import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';

import { RegionFieldsStateType } from '@/pages/Crawler/RuleConf/models/components/regionFields';
import RequestParams from './RequestParams';
import styles from '../style.less';

class LinksParams extends PureComponent {
  render() {
    return (
      <div className={styles.linksParams}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Request Params" key="1">
            <RequestParams data={[]} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Attached Params" key="2">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="Headers" key="3">
            Content of Tab Pane 3
          </Tabs.TabPane>
          <Tabs.TabPane tab="Cookies" key="4">
            Content of Tab Pane 4
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(
  ({
    linksParams,
    loading,
  }: {
    linksParams: RegionFieldsStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    linksParams,
    loading: loading.models.linksParams,
  }),
)(LinksParams);
