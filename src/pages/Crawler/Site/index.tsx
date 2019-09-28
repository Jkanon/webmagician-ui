import { Button, Col, Divider, Form, Icon, Input, Modal, message } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'dva';

import { WrappedFormUtils } from 'antd/es/form/Form';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { TablePage } from '@/components/Page';
import { StandardTableColumnProps } from '@/components/StandardTable';
import InlinePopconfirmBtn from '@/components/InlinePopconfirmBtn';
import { ModalForm } from '@/components/Form';

import LoginScriptForm from './components/LoginScriptForm';

import { SiteStateType, SiteListItem } from './model';

import { openWindow } from '@/utils/utils';

interface SiteProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  site: SiteStateType;
}

interface SiteState {
  selectedRows: SiteListItem[];
  showLoginScriptModal: boolean;
  currentRecord?: SiteListItem;
}

@connect(
  ({
    site,
    loading,
  }: {
    site: SiteStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    site,
    loading: loading.models.site,
  }),
)
class Site extends Component<SiteProps, SiteState> {
  state: SiteState = {
    selectedRows: [],
    showLoginScriptModal: false,
  };

  // @ts-ignore
  private pageRef: TablePage | null = null;

  columns: StandardTableColumnProps<SiteListItem>[] = [
    {
      title: 'LOGO',
      dataIndex: 'logo',
      render: (text: string, record: SiteListItem) => {
        if (text) {
          return (
            <div style={{ height: 50 }}>
              <img src={text} style={{ height: '100%' }} alt={record.name} />
            </div>
          );
        }
        return '暂无图片';
      },
      width: 120,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.name" />,
      dataIndex: 'name',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.short-name" />,
      dataIndex: 'shortName',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.home-page" />,
      dataIndex: 'homePage',
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
      width: 250,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.timeout" />,
      dataIndex: 'timeOut',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.rate-limit" />,
      dataIndex: 'rateLimit',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.retry-times" />,
      dataIndex: 'retryTimes',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.cycle-retry-times" />,
      dataIndex: 'cycleRetryTimes',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.charset" />,
      dataIndex: 'charset',
      width: 100,
    },
    {
      title: 'UserAgent',
      dataIndex: 'userAgent',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.headers" />,
      dataIndex: 'headers',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.cookies" />,
      dataIndex: 'defaultCookies',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.common.label.operation" />,
      align: 'center',
      key: 'operation',
      width: 220,
      fixed: 'right',
      render: (text: string, record: SiteListItem) => (
        <>
          <ModalForm
            title={formatMessage({ id: 'app.crawler.site.edit-the-site' })}
            onSubmit={this.handleEdit}
            element={
              <a>
                <Icon type="edit" />
                <FormattedMessage id="component.common.text.edit" />
              </a>
            }
            formItems={this.modalFormItems}
            formValues={record}
          />
          <Divider type="vertical" />
          <a
            onClick={() => {
              this.showModal(record);
            }}
          >
            <Icon type="edit" />
            <FormattedMessage id="app.crawler.site.edit-the-login-script" />
          </a>
          <Divider type="vertical" />
          <InlinePopconfirmBtn onConfirm={() => this.onDelete([record.id])} />
        </>
      ),
    },
  ];

  modalFormItems = [
    {
      label: 'id',
      name: 'id',
      itemRender: <Input type="hidden" />,
      hidden: true,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.home-page" />,
      name: 'homePage',
      rules: [
        {
          required: true,
          message: '首页链接不能为空',
        },
        {
          type: 'url',
          message: '请输入正确的链接地址!',
        },
      ],
      itemRender: <Input placeholder="首页链接" />,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.name" />,
      name: 'name',
      rules: [
        {
          required: true,
          message: '站点名称不能为空',
        },
      ],
      itemRender: <Input placeholder="请输入站点全称" />,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.short-name" />,
      name: 'shortName',
      itemRender: <Input placeholder="请输入站点简称" />,
    },
    {
      label: 'LOGO',
      name: 'logo',
      itemRender: <Input placeholder="请输入LOGO链接地址" />,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.timeout" />,
      name: 'timeOut',
      itemRender: <Input placeholder="超时时间，单位s(秒)" />,
      toggleField: true,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.charset" />,
      name: 'charset',
      itemRender: <Input placeholder="请输入字符编码" />,
      toggleField: true,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.retry-times" />,
      name: 'retryTimes',
      itemRender: <Input placeholder="请输入重试次数" />,
      toggleField: true,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.cycle-retry-times" />,
      name: 'cycleRetryTimes',
      itemRender: <Input placeholder="请输入循环重试次数" />,
      toggleField: true,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.rate-limit" />,
      name: 'rateLimit',
      itemRender: <Input placeholder="请输入流量限制，单位请求次数/秒。默认无限制" />,
      toggleField: true,
    },
    {
      label: 'UserAgent',
      name: 'userAgent',
      itemRender: <Input.TextArea placeholder="请输入UserAgent" style={{ minHeight: 100 }} />,
      toggleField: true,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.headers" />,
      name: 'headers',
      itemRender: <Input.TextArea placeholder="请输入Headers" style={{ minHeight: 150 }} />,
      toggleField: true,
    },
    {
      label: <FormattedMessage id="app.crawler.site.label.cookies" />,
      name: 'defaultCookies',
      itemRender: <Input.TextArea placeholder="请输入默认Cookies" style={{ minHeight: 100 }} />,
      toggleField: true,
    },
  ];

  showModal = (currentRecord: SiteListItem) => {
    this.setState({ showLoginScriptModal: true, currentRecord });
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
      type: 'site/remove',
      payload: {
        ids: ids.join(','),
      },
    })
      // @ts-ignore
      .then(() => {
        that.setState({
          selectedRows: selectedRows.filter(item => ids.indexOf(item.id) === -1),
        });
        that.pageRef.doSearch();
        message.success(formatMessage({ id: 'component.common.text.deleted-success' }));
      })
      .catch(() => {});
  };

  handleAdd = (fields: any, form: WrappedFormUtils) => this.handleAddOrEdit('site/create', fields);

  handleEdit = (fields: any, form: WrappedFormUtils) => this.handleAddOrEdit('site/modify', fields);

  handleAddOrEdit = (type: string, fields: any) => {
    const { dispatch } = this.props;
    const that = this;
    return dispatch({
      type,
      payload: fields,
      // @ts-ignore
    }).then(() => {
      that.pageRef.doSearch();
      message.success(
        formatMessage({
          id: `component.common.text.${(type.indexOf('create') !== -1 && 'add') || 'edit'}-success`,
        }),
      );
    });
  };

  handleSelectRows = (rows: SiteListItem[]) => {
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
      title={formatMessage({ id: 'app.crawler.site.add-new-site' })}
      onSubmit={this.handleAdd}
      element={
        <Button type="primary" icon="plus">
          <FormattedMessage id="component.common.text.add" />
        </Button>
      }
      formItems={this.modalFormItems}
    />
  );

  render() {
    const {
      dispatch,
      loading,
      site: { data },
    } = this.props;
    const { selectedRows, showLoginScriptModal, currentRecord } = this.state;

    return (
      <>
        <TablePage
          // @ts-ignore
          wrappedComponentRef={(node: TablePage) => {
            this.pageRef = node;
          }}
          title={formatMessage({ id: 'menu.site' })}
          action="site/fetch"
          columns={this.columns}
          data={data}
          loading={loading}
          searchFormRender={this.searchFormRender}
          operatorRender={this.operatorRender}
          selectedRows={selectedRows}
          handleSelectRows={this.handleSelectRows}
          onDelete={(rows: SiteListItem[]) => this.onDelete(rows.map(row => row.id))}
          dispatch={dispatch}
        />
        <Modal
          title="配置登录脚本"
          visible={showLoginScriptModal}
          width={500}
          footer={null}
          centered
          destroyOnClose
          onCancel={() => this.setState({ showLoginScriptModal: false })}
        >
          <LoginScriptForm
            loginJudgeExpression={currentRecord && currentRecord.loginJudgeExpression}
          />
        </Modal>
      </>
    );
  }
}

export default Site;
