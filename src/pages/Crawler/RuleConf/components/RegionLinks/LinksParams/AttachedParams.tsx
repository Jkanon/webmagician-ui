import React, { Component } from 'react';
import { Input } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';

import { StandardTableColumnProps } from '@/components/StandardTable';
import { LinksParamsItem } from '../../../models/components/linksParams';
import { TablePage } from '@/components/Page';

interface AttachedParamsProps {
  data: LinksParamsItem[];
}

class AttachedParams extends Component<AttachedParamsProps> {
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
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.fields.selector" />,
      dataIndex: 'selector',
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
      title: <FormattedMessage id="app.common.label.memo" />,
      dataIndex: 'remarks',
      editingRender: {
        itemRender: () => <Input />,
      },
    },
  ];

  render() {
    return (
      // @ts-ignore
      <TablePage columns={this.columns} data={{ list: this.props.data, pagination: false }} />
    );
  }
}

export default AttachedParams;
