import { Button, Col, Divider, Form, Icon, Input, Modal, message } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'dva';

import { WrappedFormUtils } from 'antd/es/form/Form';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { TablePage } from '@/components/Page';
import { StandardTableColumnProps } from '@/components/StandardTable';
import InlinePopconfirmBtn from '@/components/InlinePopconfirmBtn';
import { ModalForm } from '@/components/Form';

import LoginScriptForm from './Form/LoginScriptForm';

import AceEditor from 'react-ace';
import { SiteStateType, SiteListItem } from './model';

import { openWindow } from '@/utils/utils';

// eslint-disable-next-line import/no-extraneous-dependencies
// import 'brace/mode/javascript';
// eslint-disable-next-line import/no-extraneous-dependencies
// import 'brace/theme/github';

interface SiteProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  site: SiteStateType;
}

interface SiteState {
  selectedRows: SiteListItem[];
  showLoginScriptModal: boolean;
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

  columns: StandardTableColumnProps<SiteListItem>[] = [
    {
      title: 'LOGO',
      dataIndex: 'logo',
      render: (text: string, record: SiteListItem) => {
        if (text) return <img src={text} style={{ height: 50 }} alt={record.name} />;
        return '暂无图片';
      },
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.name" />,
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.short-name" />,
      dataIndex: 'shortName',
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
    },
    {
      title: <FormattedMessage id="app.crawler.site.label.timeout" />,
      dataIndex: 'timeOut',
    },
    {
      title: <FormattedMessage id="app.common.label.operation" />,
      align: 'center',
      key: 'operation',
      render: (text: string, record: SiteListItem) => (
        <Fragment>
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
          <a onClick={this.showModal}>
            <Icon type="edit" />
            登录脚本
          </a>
          <Divider type="vertical" />
          <InlinePopconfirmBtn onConfirm={() => this.onDelete([record.id])} />
        </Fragment>
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
      label: '默认Headers',
      name: 'headers',
      itemRender: <Input.TextArea placeholder="请输入Headers" style={{ minHeight: 150 }} />,
      toggleField: true,
    },
    {
      label: '默认Cookies',
      name: 'defaultCookies',
      itemRender: <Input.TextArea placeholder="请输入默认Cookies" style={{ minHeight: 100 }} />,
      toggleField: true,
    },
  ];

  showModal = () => {
    this.setState({ showLoginScriptModal: true });
  };

  /**
   * 删除回调函数
   * @param ids
   */
  onDelete = (ids: string[]) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!ids) return;
    dispatch({
      type: 'site/remove',
      payload: {
        ids: ids.join(','),
      },
    }).then(() => {
      this.setState({
        selectedRows: selectedRows.filter(item => ids.indexOf(item.id) === -1),
      });
      dispatch({
        type: 'site/fetch',
      });
      message.success(formatMessage({ id: 'component.common.text.deleted-success' }));
    });
  };

  handleAdd = (fields: any, form: WrappedFormUtils) => this.handleAddOrEdit('site/create', fields);

  handleEdit = (fields: any, form: WrappedFormUtils) => this.handleAddOrEdit('site/modify', fields);

  handleAddOrEdit = (type: string, fields: any) => {
    const { dispatch } = this.props;
    return dispatch({
      type,
      payload: fields,
    }).then(() => {
      dispatch({
        type: 'site/fetch',
      });
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
    const { selectedRows, showLoginScriptModal } = this.state;

    return (
      <>
        <TablePage
          title="站点配置"
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
          title="Basic Modal"
          visible={showLoginScriptModal}
          onCancel={() => this.setState({ showLoginScriptModal: false })}
        >
          <LoginScriptForm />
        </Modal>
      </>
    );
  }
}

export default Site;
