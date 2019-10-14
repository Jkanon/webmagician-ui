import React, { Component } from 'react';
import { Button, Col, Form, Row } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { isFunction } from 'lodash';

import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';

import styles from '@/components/Page/TablePage/index.less';

interface SearchPanelProps extends FormComponentProps {
  searchFormRender: (form: WrappedFormUtils) => React.ReactNode;
  onSearch?: (fieldsValue: any) => void;
  onReset?: () => void;
}

class SearchPanel extends Component<SearchPanelProps> {
  handleFormReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    if (onReset && isFunction(onReset)) {
      onReset();
    }
  };

  /**
   * Search Handler
   * @param e
   */
  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { onSearch } = this.props;
      if (onSearch && isFunction(onSearch)) {
        onSearch(fieldsValue);
      }
    });
  };

  /**
   * Search form render
   */
  renderSearchForm() {
    const { searchFormRender, form } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {searchFormRender && searchFormRender(form)}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="component.tablePage.text.search" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id="component.tablePage.text.reset" />
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return <div className={styles.tableListForm}>{this.renderSearchForm()}</div>;
  }
}

export default Form.create<SearchPanelProps>()(SearchPanel);
