import { Button, Col, Divider, Form, Icon, Input, message } from 'antd';
import React, { Component, RefObject } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'dva';

import { WrappedFormUtils } from 'antd/es/form/Form';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { TablePage } from '@/components/Page';
import { StandardTableColumnProps } from '@/components/StandardTable';
import InlinePopconfirmBtn from '@/components/InlinePopconfirmBtn';
import { ModalForm } from '@/components/Form';
import { openWindow } from '@/utils/utils';

import { PageInfoListItem, RuleConfStateType } from './models/ruleConf';
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

class RuleConf extends Component<RuleConfProps, RuleConfState> {
  state: RuleConfState = {
    selectedRows: [],
  };

  private pageRef: RefObject<TablePage<PageInfoListItem>> = React.createRef();

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
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();
            openWindow(text);
          }}
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
          />
          <Divider type="vertical" />
          <ModalForm
            title={formatMessage({ id: 'app.crawler.rule-conf.add-new-page-region' })}
            onSubmit={this.handleAddPageRegion}
            element={
              <a>
                <Icon type="plus" />
                <FormattedMessage id="app.crawler.rule-conf.operation.label.add-region" />
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

  expandedRowRender = (record: PageInfoListItem) => {
    const { dispatch } = this.props;
    if (record.pageRegions && record.pageRegions.length > 0) {
      return (
        <PageRegion
          data={{
            list: record.pageRegions || [],
            pagination: record.pageRegions.length > 10 ? undefined : false,
          }}
          dispatch={dispatch}
        />
      );
    }
    return null;
  };

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
        if (that.pageRef.current) {
          that.pageRef.current.doSearch();
        }
        message.success(formatMessage({ id: 'component.common.text.deleted-success' }));
      })
      .catch(() => {});
  };

  handleAddPageRegion = (fields: any) => this.handleAddOrEdit('ruleConf/createPageRegion', fields);

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
      if ((type.endsWith('create') || type.endsWith('modify')) && that.pageRef.current) {
        that.pageRef.current.doSearch();
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
      <TablePage<PageInfoListItem>
        ref={this.pageRef}
        title={formatMessage({ id: 'menu.rule-conf' })}
        action="ruleConf/fetch"
        columns={this.columns}
        expandedRowRender={this.expandedRowRender}
        data={data}
        loading={loading}
        searchFormRender={this.searchFormRender}
        operatorRender={this.operatorRender}
        handleSelectRows={this.handleSelectRows}
        selectedRows={selectedRows}
        onDelete={(rows: PageInfoListItem[]) => this.onDelete(rows.map(row => row.id))}
        dispatch={dispatch}
        tableOptions={{ scroll: { x: false }, expandRowByClick: true }}
      />
    );
  }
}

export default connect(
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
)(RuleConf);
