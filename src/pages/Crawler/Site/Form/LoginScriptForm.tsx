import React, { PureComponent } from 'react';
import { Input, Steps } from 'antd';

import { BaseForm } from '@/components/Form';

const { Step } = Steps;

const formItems = [
  {
    name: 'loginJudgeExpression',
    itemRender: <Input />,
  },
];

class LoginScriptForm extends PureComponent {
  render() {
    return (
      <>
        <Steps>
          <Step title="填写登录验证表达式" />
          <Step title="填写自动登录脚本" />
        </Steps>
        <BaseForm formItems={formItems} />
      </>
    );
  }
}

export default LoginScriptForm;
