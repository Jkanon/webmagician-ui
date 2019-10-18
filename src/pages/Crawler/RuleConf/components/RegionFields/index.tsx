import React, { Component, RefObject } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Divider, Dropdown, Icon, Input, Menu, message, Switch } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { StandardTableColumnProps } from '@/components/StandardTable';
import { TablePage } from '@/components/Page';
import {
  RegionFieldsItem,
  RegionFieldsStateType,
} from '@/pages/Crawler/RuleConf/models/components/regionFields';
import InlinePopconfirmBtn from '@/components/InlinePopconfirmBtn';

interface RegionFieldsProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  regionFields: RegionFieldsStateType;
  regionId: string;
}

interface RegionFieldsState {
  editingId: string;
}

class RegionFields extends Component<RegionFieldsProps, RegionFieldsState> {
  columns: StandardTableColumnProps<RegionFieldsItem>[] = [
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.fields.name" />,
      dataIndex: 'name',
      editingRender: {
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: <FormattedMessage id="app.common.validation.not-empty" />,
            },
          ],
        },
        itemRender: () => <Input />,
      },
      width: 300,
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.fields.alias" />,
      dataIndex: 'alias',
      editingRender: {
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: <FormattedMessage id="app.common.validation.not-empty" />,
            },
          ],
        },
        itemRender: () => <Input />,
      },
      width: 100,
    },
    {
      title: 'selector',
      dataIndex: 'selector',
      ellipsis: true,
      editingRender: {
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: <FormattedMessage id="app.common.validation.not-empty" />,
            },
          ],
        },
        itemRender: () => <Input.TextArea autoSize />,
      },
      width: 100,
    },
    {
      title: 'validationSelector',
      dataIndex: 'validationSelector',
      ellipsis: true,
      editingRender: {
        itemRender: () => <Input.TextArea autoSize />,
      },
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.fields.required" />,
      dataIndex: 'required',
      render: (text, record) => <Switch defaultChecked={text} disabled={!record.editing} />,
      editingRender: {
        fieldDecoratorOptions: {
          valuePropName: 'checked',
        },
        itemRender: () => <Switch />,
      },
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.fields.primary-key" />,
      dataIndex: 'primaryKey',
      render: (text, record) => <Switch defaultChecked={text} disabled={!record.editing} />,
      editingRender: {
        fieldDecoratorOptions: {
          valuePropName: 'checked',
        },
        itemRender: () => <Switch />,
      },
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.fields.repeated" />,
      dataIndex: 'repeated',
      render: (text, record) => <Switch defaultChecked={text} disabled={!record.editing} />,
      editingRender: {
        fieldDecoratorOptions: {
          valuePropName: 'checked',
        },
        itemRender: () => <Switch />,
      },
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.fields.temp" />,
      dataIndex: 'temp',
      render: (text, record) => <Switch defaultChecked={text} disabled={!record.editing} />,
      editingRender: {
        fieldDecoratorOptions: {
          valuePropName: 'checked',
        },
        itemRender: () => <Switch />,
      },
      width: 100,
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.fields.download" />,
      dataIndex: 'download',
      render: (text, record) => <Switch defaultChecked={text} disabled={!record.editing} />,
      editingRender: {
        fieldDecoratorOptions: {
          valuePropName: 'checked',
        },
        itemRender: () => <Switch />,
      },
      width: 100,
    },
    {
      title: <FormattedMessage id="app.common.label.memo" />,
      dataIndex: 'remarks',
      editingRender: {
        itemRender: () => <Input.TextArea autoSize />,
      },
      width: 100,
    },
    {
      title: <FormattedMessage id="app.common.label.operation" />,
      align: 'center',
      key: 'operation',
      fixed: 'right',
      width: 200,
      render: (text, record, index, form) => {
        const { editingId } = this.state;
        const menu = (
          <Menu>
            <Menu.Item>
              <a>
                <Icon type="plus" />
                <FormattedMessage id="app.crawler.rule-conf.operation.label.add-field" />
              </a>
            </Menu.Item>
          </Menu>
        );
        return (
          <>
            {record.editing ? (
              <>
                <a onClick={() => this.handleEditSave(form)}>
                  <Icon type="check" />
                  <FormattedMessage id="component.common.text.save" />
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={() => this.handleEditCancel()}>
                  <Icon type="close" />
                  <FormattedMessage id="component.common.text.cancel" />
                </a>
              </>
            ) : (
              <a disabled={editingId !== ''} onClick={() => this.handleEditClick(record.id)}>
                <Icon type="edit" />
                <FormattedMessage id="component.common.text.edit" />
              </a>
            )}
            <Divider type="vertical" />
            <InlinePopconfirmBtn onConfirm={() => this.onDelete([record.id])} />
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                <FormattedMessage id="app.common.bale.more" /> <Icon type="down" />
              </a>
            </Dropdown>
          </>
        );
      },
    },
  ];

  private pageRef: RefObject<TablePage<RegionFieldsItem>> = React.createRef();

  constructor(props: RegionFieldsProps) {
    super(props);
    this.state = {
      editingId: '',
    };
  }

  handleEditClick = (index: string) => {
    this.setState({
      editingId: index,
    });
  };

  handleEditSave = (form?: WrappedFormUtils) => {
    if (form) {
      // @ts-ignore
      form.validateFields().then((fieldsValue: RegionFieldsItem) => {
        const { editingId } = this.state;
        this.handleEdit({ id: editingId, ...fieldsValue }).then(() => {
          this.resetEditingId();
        });
      });
    }
  };

  handleEditCancel = () => {
    this.resetEditingId();
  };

  handleEdit = (fields: any) => this.handleAddOrEdit('regionFields/modify', fields);

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

  resetEditingId = () => {
    this.setState({
      editingId: '',
    });
  };

  onDelete = (ids: string[]) => {
    const { dispatch } = this.props;

    if (!ids) return;
    const that = this;
    dispatch({
      type: 'regionFields/remove',
      payload: {
        ids: ids.join(','),
      },
    })
      // @ts-ignore
      .then(() => {
        if (that.pageRef.current) {
          that.pageRef.current.doSearch();
        }
        message.success(formatMessage({ id: 'component.common.text.deleted-success' }));
      })
      .catch(() => {});
  };

  assemblyDataList = ({ children, id, ...rest }: RegionFieldsItem): RegionFieldsItem => {
    const { editingId } = this.state;
    return {
      id,
      ...rest,
      editing: id === editingId,
      children:
        children && children.length > 0 ? children.map(x => this.assemblyDataList(x)) : undefined,
    };
  };

  render() {
    const {
      dispatch,
      loading,
      regionFields: { data: originalData },
      regionId,
    } = this.props;
    const { editingId } = this.state;
    const { list, pagination } = originalData;
    const data =
      editingId === ''
        ? originalData
        : {
            list: list.map(x => this.assemblyDataList(x)),
            pagination,
          };

    return (
      <TablePage
        ref={this.pageRef}
        columns={this.columns}
        dispatch={dispatch}
        loading={loading}
        data={data}
        action="regionFields/fetch"
        searchParams={{ regionId }}
      />
    );
  }
}

export default connect(
  ({
    regionFields,
    loading,
  }: {
    regionFields: RegionFieldsStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    regionFields,
    loading: loading.models.regionFields,
  }),
)(RegionFields);
