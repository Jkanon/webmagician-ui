import React from 'react';
import { Form } from 'antd';
import { get } from 'lodash';

/**
 * 默认表单布局
 */
const defaultFormLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const fetchFieldDecorator = (item, getFieldDecorator) => {
  const { name, defaultValue, rules, itemRender, fieldDecoratorProps } = item;
  return getFieldDecorator(name, {
    initialValue: defaultValue,
    rules,
    ...fieldDecoratorProps,
  })(itemRender);
};

/**
 * render single FormItem
 *
 * @param item
 * @param getFieldDecorator
 * @returns {*}
 */
export const renderFormItem = (item, getFieldDecorator) => {
  const { name, label, formItemLayout, style, formItemProps } = item;
  return (
    <Form.Item key={name} label={label} {...formItemLayout} style={style} {...formItemProps}>
      {fetchFieldDecorator(item, getFieldDecorator)}
    </Form.Item>
  );
};

/**
 * render multiple FormItem
 * @param items
 * @param getFieldDecorator
 * @param formValues
 * @param toggleFieldVisibility
 * @param layout
 * @return
 */
export const renderFormItems = (
  items,
  getFieldDecorator,
  formValues = {},
  toggleFieldVisibility,
  layout,
) =>
  items.map(item => {
    const { style, defaultValue, hidden, ...restProps } = item;
    const display =
      ((hidden === true || (item.toggleField && toggleFieldVisibility === false)) && 'none') ||
      'block';
    return renderFormItem(
      {
        formItemLayout: layout === 'vertical' ? null : defaultFormLayout,
        ...restProps,
        style: { ...style, display },
        defaultValue: get(formValues, item.name, defaultValue),
      },
      getFieldDecorator,
    );
  });
