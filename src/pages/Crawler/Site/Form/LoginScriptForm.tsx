import React, { PureComponent } from 'react';
import { Input, Steps } from 'antd';

import { BaseForm } from '@/components/Form';

import AceEditor from 'react-ace';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'brace/ext/language_tools';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'brace/mode/javascript';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'brace/theme/github';

const { Step } = Steps;

const formItems = [
  {
    name: 'loginJudgeExpression',
    itemRender: <Input />,
  },
];

interface LoginScriptFormState {
  current: number;
}

class LoginScriptForm extends PureComponent<any, LoginScriptFormState> {
  state = {
    current: 0,
  };

  onChange = (current: number) => {
    this.setState({ current });
  };

  render() {
    const { current } = this.state;
    return (
      <>
        <Steps current={current} onChange={this.onChange}>
          <Step title="填写登录验证表达式" />
          <Step title="填写自动登录脚本" />
        </Steps>
        <div style={{ marginTop: 20, maxHeight: 'calc(100vh - 230px)', overflowY: 'auto' }}>
          {current === 0 && <BaseForm formItems={formItems} layout="vertical" />}
          {current === 1 && (
            <AceEditor
              placeholder="登录脚本"
              mode="javascript"
              theme="github"
              name="autoLoginScript"
              fontSize={14}
              width="100%"
              showPrintMargin
              showGutter
              highlightActiveLine
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
                wrap: true,
              }}
            />
          )}
        </div>
      </>
    );
  }
}

export default LoginScriptForm;
