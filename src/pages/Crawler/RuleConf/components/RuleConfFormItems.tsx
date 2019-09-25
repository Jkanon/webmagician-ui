import React from 'react';
import { Input, Switch, Radio } from 'antd';
import { FormattedMessage, formatMessage, getLocale } from 'umi-plugin-react/locale';

import { checkUrlRegex } from '../service';

async function urlRegexValidator(rules: any, value: string) {
  // @ts-ignore
  return checkUrlRegex(this.getFieldValue('urlRegex'), this.getFieldValue('urlExample')).then(
    ({ data }) => {
      if (data) {
        return Promise.resolve(value);
      }
      return Promise.reject(new Error(formatMessage({ id: 'app.common.err.record.exist' })));
    },
  );
}

function getItems() {
  const layout = {
    labelCol: {
      span: getLocale() === 'en-US' ? 7 : 5,
    },
    wrapperCol: {
      span: getLocale() === 'en-US' ? 13 : 15,
    },
  };

  return [
    {
      label: 'id',
      name: 'id',
      itemRender: <Input type="hidden" />,
      hidden: true,
    },
    {
      label: <FormattedMessage id="app.crawler.rule-conf.label.name" />,
      name: 'name',
      rules: [
        {
          required: true,
          message: <FormattedMessage id="app.crawler.rule-conf.validation.name.not-empty" />,
        },
      ],
      itemRender: <Input placeholder={formatMessage({ id: 'app.crawler.rule-conf.label.name' })} />,
      formItemLayout: layout,
    },
    {
      label: <FormattedMessage id="app.crawler.rule-conf.label.url-regex" />,
      name: 'urlRegex',
      rules: [
        {
          required: true,
          message: <FormattedMessage id="app.crawler.rule-conf.validation.url-regex.not-empty" />,
        },
        {
          // @ts-ignore
          validator: urlRegexValidator.bind(this),
        },
      ],
      itemRender: <Input placeholder="URL正则表达式" />,
      formItemLayout: layout,
    },
    {
      label: <FormattedMessage id="app.crawler.rule-conf.label.example-url" />,
      name: 'urlExample',
      rules: [
        {
          type: 'url',
          message: <FormattedMessage id="app.crawler.rule-conf.validation.url.not-match" />,
        },
      ],
      itemRender: <Input placeholder="URL示例" />,
      formItemLayout: layout,
    },
    {
      label: <FormattedMessage id="app.crawler.rule-conf.label.enable-js" />,
      name: 'enableJs',
      itemRender: <Switch />,
      formItemLayout: layout,
      fieldDecoratorProps: { valuePropName: 'checked' },
    },
    {
      label: <FormattedMessage id="app.crawler.rule-conf.label.enable-redirect" />,
      name: 'enableRedirect',
      itemRender: <Switch />,
      formItemLayout: layout,
      defaultValue: true,
      fieldDecoratorProps: { valuePropName: 'checked' },
    },
    {
      label: <FormattedMessage id="app.crawler.rule-conf.label.method" />,
      name: 'method',
      rules: [
        {
          required: true,
          message: '请选择请求方式',
        },
      ],
      itemRender: (
        <Radio.Group>
          <Radio value="GET">GET</Radio>
          <Radio value="POST">POST</Radio>
          <Radio value="PUT">PUT</Radio>
          <Radio value="DELETE">DELETE</Radio>
        </Radio.Group>
      ),
      defaultValue: 'GET',
      formItemLayout: layout,
      formItemProps: {
        className: 'wrap-label',
      },
    },
    {
      label: <FormattedMessage id="app.crawler.rule-conf.label.example-params" />,
      name: 'pageParamsExample',
      itemRender: <Input.TextArea placeholder="请输入JSON格式的内容" style={{ minHeight: 100 }} />,
      formItemLayout: layout,
      formItemProps: {
        className: 'wrap-label',
      },
    },
    {
      label: <FormattedMessage id="app.crawler.rule-conf.label.validation-selector" />,
      name: 'pageValidationSelector',
      itemRender: <Input.TextArea placeholder="页面验证解析表达式" style={{ minHeight: 100 }} />,
      formItemLayout: layout,
      formItemProps: {
        className: 'wrap-label',
      },
    },

    {
      label: <FormattedMessage id="app.common.label.memo" />,
      name: 'remarks',
      itemRender: <Input.TextArea placeholder="请输入内容" style={{ minHeight: 100 }} />,
      formItemLayout: layout,
    },
  ];
}

export default getItems;
