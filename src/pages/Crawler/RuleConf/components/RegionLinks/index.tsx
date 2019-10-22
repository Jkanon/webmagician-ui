import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Select } from 'antd';
import { Dispatch } from 'redux';
import { FormattedMessage } from 'umi-plugin-react/locale';

import { StandardTableColumnProps } from '@/components/StandardTable';
import {
  RegionLinksItem,
  RegionLinksStateType,
} from '@/pages/Crawler/RuleConf/models/components/regionLinks';
import { TablePage } from '@/components/Page';
import LinksParams from './LinksParams';

interface RegionLinksProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  regionLinks: RegionLinksStateType;
  regionId: string;
}

interface RegionLinksState {
  editingRecord: RegionLinksItem | null;
}

class RegionLinks extends Component<RegionLinksProps, RegionLinksState> {
  columns: StandardTableColumnProps<RegionLinksItem>[] = [
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.links.name" />,
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
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.links.method" />,
      dataIndex: 'method',
      editingRender: {
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: <FormattedMessage id="app.common.validation.not-empty" />,
            },
          ],
        },
        itemRender: text => (
          <Select defaultValue={text || 'GET'}>
            <Select.Option value="GET">GET</Select.Option>
            <Select.Option value="POST">POST</Select.Option>
            <Select.Option value="PUT">PUT</Select.Option>
            <Select.Option value="DELETE">DELETE</Select.Option>
          </Select>
        ),
      },
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.links.type" />,
      dataIndex: 'type',
      editingRender: {
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: <FormattedMessage id="app.common.validation.not-empty" />,
            },
          ],
        },
        itemRender: () => (
          <Select>
            <Select.Option value="GET">Get</Select.Option>
            <Select.Option value="POST">Post</Select.Option>
            <Select.Option value="PUT">Put</Select.Option>
            <Select.Option value="DELETE">Delete</Select.Option>
          </Select>
        ),
      },
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.links.selector" />,
      dataIndex: 'selector',
      ellipsis: true,
      editingRender: {
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: <FormattedMessage id="app.common.validation.not-empty" />,
            },
          ],
        },
        itemRender: () => <Input.TextArea autoSize />,
      },
    },
    {
      title: <FormattedMessage id="app.common.label.operation" />,
      align: 'center',
      key: 'operation',
      width: 300,
      render: () => <div>test</div>,
    },
  ];

  operatorRender = () => (
    <Button type="primary" icon="plus">
      <FormattedMessage id="component.common.text.add" />
    </Button>
  );

  expandedRowRender = () => <LinksParams />;

  render() {
    const {
      dispatch,
      loading,
      regionLinks: { data },
      regionId,
    } = this.props;

    return (
      <TablePage
        columns={this.columns}
        dispatch={dispatch}
        loading={loading}
        data={data}
        expandedRowRender={this.expandedRowRender}
        action="regionLinks/fetch"
        searchParams={{ regionId }}
        operatorRender={{ left: this.operatorRender, right: [{ title: 'refresh' }] }}
        tableOptions={{ scroll: { x: false } }}
      />
    );
  }
}

export default connect(
  ({
    regionLinks,
    loading,
  }: {
    regionLinks: RegionLinksStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    regionLinks,
    loading: loading.models.regionLinks,
  }),
)(RegionLinks);
