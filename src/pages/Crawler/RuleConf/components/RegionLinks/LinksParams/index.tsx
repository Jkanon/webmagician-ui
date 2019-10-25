import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { groupBy } from 'lodash';

import { LinksParamsStateType } from '@/pages/Crawler/RuleConf/models/components/linksParams';
import RequestParams from './RequestParams';

import styles from '../style.less';

interface LinksParamsProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  linksParams: LinksParamsStateType;
  linkId: string;
}

class LinksParams extends PureComponent<LinksParamsProps> {
  componentWillMount(): void {
    const { dispatch, linkId } = this.props;
    dispatch({
      type: 'linksParams/fetch',
      payload: {
        linkId,
      },
    });
  }

  render() {
    const {
      linksParams: {
        data: { list },
      },
    } = this.props;
    const dataGroupBy = groupBy(list, 'type');
    return (
      <div className={styles.linksParams}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Request Params" key="1">
            <RequestParams data={dataGroupBy['1'] || []} />
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
    linksParams: LinksParamsStateType;
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
