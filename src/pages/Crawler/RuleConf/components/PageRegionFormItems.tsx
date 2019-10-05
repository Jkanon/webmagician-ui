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
    label: '名称',
    name: 'name',
    itemRender: <Input placeholder="" />,
    rules: [
      {
        required: true,
        message: <FormattedMessage id="app.crawler.rule-conf.validation.name.not-empty" />,
      },
    ],
  },
  {
    label: '区域表达式',
    name: 'selector',
    itemRender: <Input />,
    rules: [
      {
        required: true,
        message: <FormattedMessage id="app.crawler.rule-conf.validation.name.not-empty" />,
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
