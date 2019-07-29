import React, { PureComponent } from 'react';

import { Form, Input, Switch, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { FormComponentProps } from 'antd/es/form';
import { formatMessage, getLocale } from 'umi-plugin-react/locale';

import { PageInfoListItem } from '@/pages/Crawler/RuleConf/model';

interface RuleConfFormProps extends FormComponentProps {
  record: PageInfoListItem;
}

interface RuleConfFormState {
  method: string;
}

export default class RuleConfForm extends PureComponent<RuleConfFormProps, RuleConfFormState> {
  constructor(props: RuleConfFormProps) {
    super(props);
    // @ts-ignore
    const { record: { method } = {} } = this.props;
    this.state = {
      method: method || 'GET',
    };
  }

  onChange = (e: RadioChangeEvent) => {
    this.setState({
      method: e.target.value,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      record,
    } = this.props;
    const { method } = this.state;
    const layout = {
      labelCol: {
        span: getLocale() === 'en-US' ? 7 : 5,
      },
      wrapperCol: {
        span: getLocale() === 'en-US' ? 13 : 15,
      },
    };

    return (
      <>
        {getFieldDecorator('id', {
          initialValue: record.id,
        })(<Input type="hidden" />)}
        <Form.Item {...layout} label={formatMessage({ id: 'app.crawler.rule-conf.label.name' })}>
          {getFieldDecorator('name', {
            initialValue: record.name,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'app.crawler.rule-conf.validation.name.not-empty' }),
              },
            ],
          })(<Input placeholder="页面名称" />)}
        </Form.Item>
        <Form.Item
          {...layout}
          label={formatMessage({ id: 'app.crawler.rule-conf.label.url-regex' })}
        >
          {getFieldDecorator('urlRegex', {
            initialValue: record.urlRegex,
            rules: [
              {
                required: true,
                message: '请输入URL匹配的正则表达式',
              },
            ],
          })(<Input placeholder="URL正则表达式" />)}
        </Form.Item>
        <Form.Item
          {...layout}
          label={formatMessage({ id: 'app.crawler.rule-conf.label.example-url' })}
        >
          {getFieldDecorator('urlExample', {
            initialValue: record.urlExample,
            rules: [
              {
                type: 'url',
                message: '请输入正确的链接地址!',
              },
            ],
          })(<Input placeholder="URL示例" />)}
        </Form.Item>
        <Form.Item
          {...layout}
          label={formatMessage({ id: 'app.crawler.rule-conf.label.enable-js' })}
        >
          {getFieldDecorator('enableJs', {
            initialValue: record.enableJs,
            rules: [
              {
                required: true,
                message: '请确认是否JS渲染',
              },
            ],
          })(<Switch />)}
        </Form.Item>
        <Form.Item {...layout} label={formatMessage({ id: 'app.crawler.rule-conf.label.method' })}>
          {getFieldDecorator('method', {
            initialValue: method,
            rules: [
              {
                required: true,
                message: '请选择请求方式',
              },
            ],
          })(
            <Radio.Group onChange={this.onChange}>
              <Radio value="GET">GET</Radio>
              <Radio value="POST">POST</Radio>
              <Radio value="PUT">PUT</Radio>
              <Radio value="DELETE">DELETE</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item
          {...layout}
          label={formatMessage({ id: 'app.crawler.rule-conf.label.example-params' })}
          className="wrap-label"
        >
          {getFieldDecorator('pageParamsExample', {
            initialValue: record.pageParamsExample,
          })(<Input.TextArea placeholder="请输入JSON格式的内容" style={{ minHeight: 100 }} />)}
        </Form.Item>
        <Form.Item
          {...layout}
          label={formatMessage({ id: 'app.crawler.rule-conf.label.validation-selector' })}
          className="wrap-label"
        >
          {getFieldDecorator('pageValidationSelector', {
            initialValue: record.pageValidationSelector,
          })(<Input.TextArea placeholder="页面验证解析表达式" style={{ minHeight: 100 }} />)}
        </Form.Item>
        <Form.Item {...layout} label={formatMessage({ id: 'app.common.label.memo' })}>
          {getFieldDecorator('pageValidationRule', {
            initialValue: record.remarks,
          })(<Input.TextArea placeholder="请输入内容" style={{ minHeight: 100 }} />)}
        </Form.Item>
      </>
    );
  }
}
