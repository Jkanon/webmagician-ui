import React, { Component, Fragment, ReactElement } from 'react';
import { ModalProps } from 'antd/es/modal';
import { Modal, Icon } from 'antd';

import defaultSettings from '../../../config/defaultSettings';

interface InlineModalProps extends ModalProps {
  element: ReactElement;
  beforeOpen?: Function;
  beforeClose?: Function;
}

interface InlineModalState {
  visible: boolean;
  wrapClassName: string;
  shrinkIcon: string;
}

class InlineModal extends Component<InlineModalProps, InlineModalState> {
  constructor(props: InlineModalProps) {
    super(props);
    this.state = {
      visible: !!props.visible,
      wrapClassName: 'wm-modal-wrap',
      shrinkIcon: 'arrows-alt',
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

  toggle = () => {
    const { wrapClassName } = this.state;
    if (wrapClassName.indexOf(' wm-modal-wrap-fullscreen') !== -1) {
      this.setState({
        wrapClassName: 'wm-modal-wrap',
        shrinkIcon: 'arrows-alt',
      });
    } else {
      this.setState({
        wrapClassName: wrapClassName.concat(' wm-modal-wrap-fullscreen'),
        shrinkIcon: 'shrink',
      });
    }
  };

  titleRender = () => {
    const { title } = this.props;
    const { shrinkIcon } = this.state;

    return (
      <>
        {title}
        <button
          type="button"
          className="ant-modal-close"
          style={{ right: 42 }}
          onClick={this.toggle}
        >
          <span className="ant-modal-close-x">
            <Icon className="ant-modal-close-icon" type={shrinkIcon} />
          </span>
        </button>
      </>
    );
  };

  render() {
    const { children, title, element, onCancel, onOk, ...modalOptions } = this.props;
    const { visible, wrapClassName } = this.state;
    const { tabsView, fixedHeader } = defaultSettings;

    const opt: Partial<ModalProps> = {};
    if (tabsView && fixedHeader) {
      // @ts-ignore
      opt.getContainer = document.querySelector('.ant-tabs-tabpane.ant-tabs-tabpane-active');
    }
    return (
      <Fragment>
        {element && React.cloneElement(element, { onClick: this.showModalHandler })}
        <Modal
          wrapClassName={wrapClassName}
          title={this.titleRender()}
          visible={visible}
          centered
          onOk={this.okHandler}
          onCancel={this.cancelHandler}
          {...opt}
          {...modalOptions}
        >
          {children}
        </Modal>
      </Fragment>
    );
  }
}

export default InlineModal;
