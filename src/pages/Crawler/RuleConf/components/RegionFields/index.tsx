import React, { Component, RefObject } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { StandardTableColumnProps } from '@/components/StandardTable';
import { TablePage } from '@/components/Page';
import {
  RegionFieldsItem,
  RegionFieldsStateType,
} from '@/pages/Crawler/RuleConf/models/components/regionFields';
import { Divider, Form, Icon, Input, message } from 'antd';
import InlinePopconfirmBtn from '@/components/InlinePopconfirmBtn';

interface RegionFieldsProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  regionFields: RegionFieldsStateType
}

interface RegionFieldsState {
  editingId: string;
}

class RegionFields extends Component<RegionFieldsProps, RegionFieldsState> {
  columns: StandardTableColumnProps<RegionFieldsItem>[] = [
    {
      title: '别名',
      dataIndex: 'alias',
      editingRender: (text, record, index, form) => {
        const { getFieldDecorator } = form;
        return (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator('alias', {
              rules: [
                {
                  required: true,
                  message: 'Please Input !',
                },
              ],
              initialValue: text,
            })(<Input />)}
          </Form.Item>
        );
      },
    },
    {
      title: <FormattedMessage id="app.common.label.operation"/>,
      align: 'center',
      key: 'operation',
      width: 200,
      render: (text, record, index) => {
        const { editingId } = this.state;
        return (
          <>
            {
              editingId === record.id ? (
                <>
                  <a>
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
                <a disabled={editingId !== '' && record.id !== editingId}
                   onClick={() => this.handleEditClick(record.id)} >
                  <Icon type="edit" />
                  <FormattedMessage id="component.common.text.edit" />
                </a>
              )
            }
            <Divider type="vertical" />
            <InlinePopconfirmBtn onConfirm={() => this.onDelete([record.id])} />
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

  handleEditCancel = () => {
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

  render() {
    const {
      dispatch,
      loading,
      regionFields: { data: originalData },
    } = this.props;
    const { editingId } = this.state;
    const { list, pagination } = originalData;

    const data = editingId === '' ? originalData : {
      list: list.map(x => ({ ...x, editing: x.id === editingId })),
      pagination,
    };

    return <TablePage
      ref={this.pageRef}
      columns={this.columns}
      dispatch={dispatch}
      loading={loading}
      data={data}
      action="regionFields/fetch" />;
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
