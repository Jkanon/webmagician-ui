import React, { Component, Fragment, ReactElement } from 'react';
import { ModalProps } from 'antd/es/modal';
import { Modal } from 'antd';

interface InlineModalProps extends ModalProps {
  element: ReactElement;
  beforeOpen?: Function;
  beforeClose?: Function;
}

interface InlineModalState {
  visible: boolean;
}

class InlineModal extends Component<InlineModalProps, InlineModalState> {
  constructor(props: InlineModalProps) {
    super(props);
    this.state = {
      visible: !!props.visible,
    };
  }

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
    const { beforeClose } = this.props;
    if (beforeClose) {
      beforeClose();
    }
    this.handleModalVisible(false);
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      visible: !!flag,
    });
  };

  okHandler = (e: React.MouseEvent<HTMLElement>) => {
    const { onOk } = this.props;
    if (onOk) {
      const ret = onOk(e);
      // @ts-ignore
      if (ret instanceof Promise) {
        ret
          .then(() => {
            this.hideModalHandler();
          })
          .catch(err => {
            console.error(err);
          });
        // @ts-ignore
      } else if (ret) {
        this.hideModalHandler();
      }
    } else {
      this.hideModalHandler();
    }
  };

  cancelHandler = (e: React.MouseEvent<HTMLElement>) => {
    const { onCancel } = this.props;
    if (onCancel) {
      const ret = onCancel(e);
      // @ts-ignore
      if (ret instanceof Promise) {
        ret
          .then(() => {
            this.hideModalHandler();
          })
          .catch(() => {});
      } else {
        this.hideModalHandler();
      }
    } else {
      this.hideModalHandler();
    }
  };

  render() {
    const { children, title, element, onCancel, onOk, ...modalOptions } = this.props;
    const { visible } = this.state;

    return (
      <Fragment>
        {element && React.cloneElement(element, { onClick: this.showModalHandler })}
        <Modal
          title={title}
          visible={visible}
          centered
          onOk={this.okHandler}
          onCancel={this.cancelHandler}
          {...modalOptions}
        >
          {children}
        </Modal>
      </Fragment>
    );
  }
}

export default InlineModal;
