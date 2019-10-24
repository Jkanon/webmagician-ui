import React, { PureComponent } from 'react';
import { Input, Tabs } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';

import { LinksParamsItem } from '../../../models/components/linksParams';

import { StandardTableColumnProps } from '@/components/StandardTable';
import { TablePage } from '@/components/Page';
import { RegionFieldsStateType } from '@/pages/Crawler/RuleConf/models/components/regionFields';

class LinksParams extends PureComponent {
  columns: StandardTableColumnProps<LinksParamsItem>[] = [
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.fields.name" />,
      dataIndex: 'name',
      editingRender: {
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: <FormattedMessage id="app.common.validation.not-empty" />,
            },
          ],
        },
        itemRender: () => <Input />,
      },
      width: 300,
    },
  ];

  renderRequestParams = () => (
    // @ts-ignore
    <TablePage action="linksParams/fetch" />
  );

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Request Params" key="1">
            {this.renderRequestParams()}
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
