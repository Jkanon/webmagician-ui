import React, { PureComponent } from 'react';
import { Input, Steps } from 'antd';

import { BaseForm } from '@/components/Form';

import AceEditor from 'react-ace';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'brace/ext/searchbox';
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

interface LoginScriptFormProps {
  loginJudgeExpression?: string;
}

interface LoginScriptFormState {
  /**
   * Index of current step
   */
  current: number;
  /**
   * Expression that determines whether need to log in
   */
  loginJudgeExpression: string;
  /**
   * Script that will be invoked to log in
   */
  loginScript: string;
}

class LoginScriptForm extends PureComponent<LoginScriptFormProps, LoginScriptFormState> {
  loginJudgeFormRef: BaseForm | null = null;

  autoLoginExpressionRef: AceEditor | null = null;

  constructor(pros: LoginScriptFormProps) {
    super(pros);
    this.state = {
      current: 0,
      loginJudgeExpression: pros.loginJudgeExpression || '',
      loginScript: '',
    };
  }

  onStepChange = (current: number) => {
    if (current === 1) {
      if (this.loginJudgeFormRef != null) {
        // @ts-ignore
        this.loginJudgeFormRef.submit().then(({ values: { loginJudgeExpression } }) => {
          this.setState({ loginJudgeExpression, current });
        });
        return;
      }
    } else if (current === 0) {
      if (this.autoLoginExpressionRef != null) {
        this.setState({
          loginScript: this.autoLoginExpressionRef.editor.getValue(),
          current,
        });
        return;
      }
    }
    this.setState({ current });
  };

  render() {
    const { current, loginJudgeExpression, loginScript } = this.state;

    return (
      <>
        <Steps current={current} onChange={this.onStepChange}>
          <Step title="填写登录验证表达式" />
          <Step title="填写自动登录脚本" />
        </Steps>
        <div style={{ marginTop: 20, maxHeight: 'calc(100vh - 230px)', overflowY: 'auto' }}>
          {current === 0 && (
            <BaseForm
              wrappedComponentRef={(v: BaseForm) => {
                this.loginJudgeFormRef = v;
              }}
              formItems={formItems}
              formValues={{ loginJudgeExpression }}
              layout="vertical"
            />
          )}
          {current === 1 && (
            <AceEditor
              ref={(ref: AceEditor) => {
                this.autoLoginExpressionRef = ref;
              }}
              placeholder="登录脚本"
              mode="javascript"
              theme="github"
              name="autoLoginScript"
              fontSize={14}
              width="100%"
              height="calc(100vh - 250px)"
              value={loginScript}
              showPrintMargin
              showGutter
              highlightActiveLine
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
                wrap: true,
                foldStyle: true,
              }}
            />
          )}
        </div>
      </>
    );
  }
}

export default LoginScriptForm;
