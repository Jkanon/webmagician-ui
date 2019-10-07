import React from 'react';
import { Input } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';

const formItems = [
  {
    label: 'id',
    name: 'id',
    itemRender: <Input type="hidden" />,
    hidden: true,
  },
  {
    label: 'pageInfoId',
    name: 'pageInfo.id',
    itemRender: <Input type="hidden" />,
    hidden: true,
  },
  {
    label: <FormattedMessage id="app.crawler.rule-conf.label.region.name" />,
    name: 'name',
    itemRender: <Input placeholder="" />,
    rules: [
      {
        required: true,
        message: <FormattedMessage id="app.common.validation.not-empty" />,
      },
    ],
  },
  {
    label: <FormattedMessage id="app.crawler.rule-conf.label.region.selector" />,
    name: 'selector',
    itemRender: <Input />,
    rules: [
      {
        required: true,
        message: <FormattedMessage id="app.common.validation.not-empty" />,
      },
    ],
  },
  {
    label: <FormattedMessage id="app.common.label.memo" />,
    name: 'remarks',
    itemRender: <Input.TextArea placeholder="请输入内容" style={{ minHeight: 100 }} />,
  },
];

export default formItems;
