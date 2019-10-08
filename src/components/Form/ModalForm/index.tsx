import React, { Component, ReactElement } from 'react';
import BaseForm from '../BaseForm';
import InlineModal, { InlineModalProps } from '../../Modal/InlineModal';

interface ModalFormProps {
  modalOptions?: InlineModalProps;
  element?: ReactElement;
  title?: React.ReactNode | string;
  width: number;
  formValues?: any;
  formItems: any;
  layout?: string;
  filter: Function;
  onSubmit: Function;
  onOk?: (e: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  onValuesChange?: (props: any, changedValues: any, allValues: any) => void;
}

interface ModalFormState {
  confirmLoading: boolean;
}

class ModalForm extends Component<ModalFormProps, ModalFormState> {
  static defaultProps = {
    /**
     * Modal width
     */
    width: 640,
    /**
     * Values of the form items
     */
    formValues: {},
    filter: (val: any) => val,
    /**
     * Handler for form submit
     */
    onSubmit: () => {},
  };

  formRef: BaseForm | null = null;

  constructor(props: ModalFormProps) {
    super(props);
    this.state = {
      /**
       * Whether to apply loading visual effect for OK button or not
       */
      confirmLoading: false,
    };
  }

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

  okHandler = (e: React.MouseEvent<HTMLElement>) => {
    if (e) e.preventDefault(); // 阻止默认行为
    // @ts-ignore
    const { formRef: { submit } = {} } = this;
    this.showLoading();
    if (submit) {
      // 通过子组件暴露的方法，显示提交表单
      return submit(e).finally(() => this.hideLoading());
    }
    this.hideLoading();
    return Promise.resolve();
  };

  cancelHandler = () => {
    this.setState({
      confirmLoading: false,
    });
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
        wrappedComponentRef={(v: BaseForm) => {
          this.formRef = v;
        }}
      >
        {children}
      </BaseForm>
    );
  };

  render() {
    const { title, element, width, onOk, onCancel, modalOptions } = this.props;
    const { confirmLoading } = this.state;

    return (
      <InlineModal
        title={title}
        width={width}
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={onOk || this.okHandler}
        onCancel={onCancel || this.cancelHandler}
        element={element}
        centered
        {...modalOptions}
      >
        {this.renderForm()}
      </InlineModal>
    );
  }
}

export default ModalForm;
