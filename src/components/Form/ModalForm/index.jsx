import React, { Component, Fragment } from 'react';
import { Modal } from 'antd';
import BaseForm from '../BaseForm';

class ModalForm extends Component {
  static defaultProps = {
    width: 640,
    formValues: {},
    filter: val => val,
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: !!props.visible,
      confirmLoading: false,
    };
  }

  handleModalVisible = flag => {
    this.setState({
      visible: !!flag,
    });
  };

  // 显示模态框
  showModalHandler = () => {
    const { beforeOpen } = this.props;
    if (beforeOpen) {
      beforeOpen();
    }
    this.handleModalVisible(true);
  };

  // 隐藏模态框
  hideModalHandler = () => {
    this.handleModalVisible(false);
  };

  showLoading = () => {
    this.setState({
      confirmLoading: true,
    });
  };

  hideLoading = () => {
    this.setState({
      confirmLoading: false,
    });
  };

  okHandler = e => {
    if (e) e.preventDefault(); // 阻止默认行为
    const { form: { submit } = {} } = this;
    this.showLoading();
    if (submit) {
      // 通过子组件暴露的方法，显示提交表单
      submit(e, this.hideModalHandler);
    }
    this.hideLoading();
  };

  cancelHandler = () => {
    this.setState({
      confirmLoading: false,
    });
    this.hideModalHandler();
  };

  renderForm = () => {
    const { children, formItems, formValues, layout, onValuesChange, onSubmit } = this.props;
    return (
      <BaseForm
        formItems={formItems}
        formValues={formValues}
        layout={layout}
        onValuesChange={onValuesChange}
        onSubmit={onSubmit}
        wrappedComponentRef={v => {
          this.form = v;
        }}
      >
        {children}
      </BaseForm>
    );
  };

  render() {
    const { title, element, width, modalOptions } = this.props;
    const { confirmLoading, visible } = this.state;

    return (
      <Fragment>
        {element && React.cloneElement(element, { onClick: this.showModalHandler })}
        <Modal
          title={title}
          visible={visible}
          width={width}
          destroyOnClose
          confirmLoading={confirmLoading}
          onOk={this.okHandler}
          onCancel={this.cancelHandler}
          centered
          {...modalOptions}
        >
          {this.renderForm()}
        </Modal>
      </Fragment>
    );
  }
}

export default ModalForm;
