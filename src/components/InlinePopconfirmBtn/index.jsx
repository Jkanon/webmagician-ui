import React, { PureComponent } from 'react';
import { Popconfirm, Icon } from 'antd';

import { FormattedMessage } from 'umi-plugin-react/locale';

import styles from './index.less';

/**
 * 行内联动popconfirm按钮
 */
export default class InlinePopconfirmBtn extends PureComponent {
  static defaultProps = {
    style: styles.textDanger,
    type: 'delete',
    title: <FormattedMessage id="component.inlinePopconfirmBtn.title" />,
    text: <FormattedMessage id="component.inlinePopconfirmBtn.text" />,
    onConfirm: () => {},
    onCancel: () => {},
  };

  render() {
    const { style, type, text, ...rest } = this.props;
    return (
      <Popconfirm {...rest}>
        <a className={style}>
          <Icon type={type} />
          {text}
        </a>
      </Popconfirm>
    );
  }
}
