import React, { Component, Fragment } from 'react';
import { Form, Icon } from 'antd';

import { isFunction } from 'lodash';
import { renderFormItems } from '../utils';

@Form.create({
  // 表单项变化时调用
  onValuesChange({ onValuesChange, ...restProps }, changedValues, allValues) {
    if (onValuesChange) onValuesChange(restProps, changedValues, allValues);
  },
})
class BaseForm extends Component {
  static defaultProps = {
    layout: 'horizontal',
    formValues: {},
    formItems: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      /**
       * 表单折叠项可见性
       */
      toggleFieldVisibility: false,
    };
  }

  /**
   * 表单提交时触发
   *
   * @param e
   */
  onSubmit = e => {
    if (e) e.preventDefault();
    this.submit(e);
  };

  /**
   * 调用表单提交
   * @param e
   * @param extraOptions 其他组件传递进来的额外参数
   */
  submit = (e, extraOptions) => {
    const { form, formValues, onSubmit } = this.props;
    return form.validateFields().then(fieldsValue => {
      const values = { ...formValues, ...fieldsValue };
      if (isFunction(onSubmit)) {
        return onSubmit(values, form, extraOptions);
      }
      return {
        values,
        form,
        extraOptions,
      };
    });
  };

  toggleForm = () => {
    const { toggleFieldVisibility } = this.state;
    this.setState({
      toggleFieldVisibility: !toggleFieldVisibility,
    });
  };

  /**
   * 默认表单主体渲染器
   * @returns {*}
   */
  renderFormBody = () => {
    const { form, formValues, layout } = this.props;
    const { toggleFieldVisibility } = this.state;

    let { formItems } = this.props;
    if (typeof formItems === 'function') {
      formItems = formItems.apply(form);
    }

    return (
      <Fragment>
        {/* eslint-disable-next-line max-len */}
        {renderFormItems(
          formItems,
          form.getFieldDecorator,
          formValues,
          toggleFieldVisibility,
          layout,
        )}
        {formItems.some(item => item.toggleField) && (
          <div style={{ textAlign: 'center' }} onClick={this.toggleForm}>
            <a style={{ marginLeft: 8 }}>
              {(toggleFieldVisibility && '收起') || '更多'}
              {(toggleFieldVisibility && <Icon type="up" />) || <Icon type="down" />}
            </a>
          </div>
        )}
      </Fragment>
    );
  };

  render() {
    const { children, layout, form, formValues, style } = this.props;

    return (
      <Form layout={layout} onSubmit={this.onSubmit} style={style}>
        {// 自定义表单内容，并且注入表单相关属性
        (children &&
          React.Children.map(children, child =>
            React.cloneElement(child, { form, record: formValues }),
          )) ||
          this.renderFormBody()}
      </Form>
    );
  }
}

export default BaseForm;
