import { Button, Col, Divider, Form, Icon, Input, message } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'dva';

import { WrappedFormUtils } from 'antd/es/form/Form';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { TablePage } from '@/components/Page';
import { StandardTableColumnProps } from '@/components/StandardTable';
import InlinePopconfirmBtn from '@/components/InlinePopconfirmBtn';
import { ModalForm } from '@/components/Form';
import { openWindow } from '@/utils/utils';

import { PageInfoListItem, RuleConfStateType } from './model';
import RuleConfFormItems from './components/RuleConfFormItems';
import PageRegion from './components/PageRegion';
import pageRegionFormItems from './components/PageRegionFormItems';

interface RuleConfProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  ruleConf: RuleConfStateType;
}

interface RuleConfState {
  selectedRows: PageInfoListItem[];
}

const expandedRowRender = (record: PageInfoListItem) => {
  if (record.pageRegions && record.pageRegions.length > 0) {
    return <PageRegion data={{ list: record.pageRegions || [], pagination: {} }} />;
  }
  return null;
};

@connect(
  ({
    ruleConf,
    loading,
  }: {
    ruleConf: RuleConfStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    ruleConf,
    loading: loading.models.ruleConf,
  }),
)
class RuleConf extends Component<RuleConfProps, RuleConfState> {
  state: RuleConfState = {
    selectedRows: [],
  };

  // @ts-ignore
  private pageRef: TablePage | null = null;

  columns: StandardTableColumnProps<PageInfoListItem>[] = [
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.name" />,
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.url-regex" />,
      dataIndex: 'urlRegex',
      width: '10%',
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.example-url" />,
      dataIndex: 'urlExample',
      width: '10%',
      render: text => (
        <a
          href={text}
          target="_blank"
          rel="noreferrer noopener"
          title={formatMessage({ id: 'app.common.label.open-in-new-window' })}
          onClick={() => openWindow(text)}
        >
          {text}
        </a>
      ),
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.enable-js" />,
      dataIndex: 'jsRendering',
      render: text => formatMessage({ id: `app.common.label.${text === 1 ? 'yes' : 'no'}` }),
      width: '10%',
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.method" />,
      dataIndex: 'method',
      width: '10%',
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.example-params" />,
      dataIndex: 'pageParamsExample',
      width: '10%',
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.validation-selector" />,
      dataIndex: 'pageValidationSelector',
    },
    {
      title: <FormattedMessage id="app.common.label.operation" />,
      align: 'center',
      key: 'operation',
      width: 200,
      render: (text, record) => (
        <>
          <ModalForm
            visible={false}
            title={formatMessage({ id: 'component.common.text.edit' })}
            onSubmit={this.handleEdit}
            element={
              <a>
                <Icon type="edit" />
                <FormattedMessage id="component.common.text.edit" />
              </a>
            }
            formItems={RuleConfFormItems}
            formValues={record}
            height={500}
          />
          <Divider type="vertical" />
          <ModalForm
            visible={false}
            title="添加解析区域"
            onSubmit={this.handleAddPageRegions}
            element={
              <a>
                <Icon type="plus" />
                区域
              </a>
            }
            formItems={pageRegionFormItems}
            formValues={{ pageInfo: { id: record.id } }}
          />
          <Divider type="vertical" />
          <InlinePopconfirmBtn onConfirm={() => this.onDelete([record.id])} />
        </>
      ),
    },
  ];

  /**
   * 删除回调函数
   * @param ids
   */
  onDelete = (ids: string[]) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!ids) return;
    const that = this;
    dispatch({
      type: 'ruleConf/remove',
      payload: {
        ids: ids.join(','),
      },
    })
      // @ts-ignore
      .then(() => {
        that.setState({
          selectedRows: selectedRows.filter(item => ids.indexOf(item.id) === -1),
        });
        if (that.pageRef) {
          that.pageRef.doSearch();
        }
        message.success(formatMessage({ id: 'component.common.text.deleted-success' }));
      })
      .catch(() => {});
  };

  handleAdd = (fields: any) => this.handleAddOrEdit('ruleConf/create', fields);

  handleEdit = (fields: any) => this.handleAddOrEdit('ruleConf/modify', fields);

  handleAddOrEdit = (type: string, fields: any) => {
    const { dispatch } = this.props;
    const that = this;
    return dispatch({
      type,
      payload: fields,
      // @ts-ignore
    }).then(() => {
      if (that.pageRef) {
        that.pageRef.doSearch();
      }
      message.success(
        formatMessage({
          id: `component.common.text.${(type.indexOf('create') !== -1 && 'add') || 'edit'}-success`,
        }),
      );
    });
  };

  handleSelectRows = (rows: PageInfoListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAddPageRegions = () => {};

  searchFormRender = (form: WrappedFormUtils) => {
    const { getFieldDecorator } = form;
    return (
      <Col md={8} sm={24}>
        <Form.Item label={<FormattedMessage id="app.crawler.site.filter.name" />}>
          {getFieldDecorator('name')(<Input placeholder="请输入" />)}
        </Form.Item>
      </Col>
    );
  };

  operatorRender = () => (
    <ModalForm
      visible={false}
      title={<FormattedMessage id="app.crawler.rule-conf.add-new-rule-conf" />}
      onSubmit={this.handleAdd}
      formItems={RuleConfFormItems}
      element={
        <Button type="primary" icon="plus">
          <FormattedMessage id="component.common.text.add" />
        </Button>
      }
    />
  );

  render() {
    const {
      dispatch,
      loading,
      ruleConf: { data },
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <TablePage
        // @ts-ignore
        wrappedComponentRef={(node: TablePage) => {
          this.pageRef = node;
        }}
        title={formatMessage({ id: 'menu.rule-conf' })}
        action="ruleConf/fetch"
        columns={this.columns}
        expandedRowRender={expandedRowRender}
        data={data}
        loading={loading}
        searchFormRender={this.searchFormRender}
        operatorRender={this.operatorRender}
        handleSelectRows={this.handleSelectRows}
        selectedRows={selectedRows}
        onDelete={(rows: PageInfoListItem[]) => this.onDelete(rows.map(row => row.id))}
        dispatch={dispatch}
        tableOptions={{ scroll: { x: false } }}
      />
    );
  }
}

export default RuleConf;
