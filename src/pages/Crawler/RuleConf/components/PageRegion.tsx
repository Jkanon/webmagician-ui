import React, { PureComponent } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import StandardTable, { StandardTableColumnProps, TableListItem } from '@/components/StandardTable';
import { TableListData } from '@/components/Page/TablePage';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Icon, message } from 'antd';
import { ModalForm } from '@/components/Form';
import pageRegionFormItems from './PageRegionFormItems';

export interface PageRegionListItem extends TableListItem {
  id: string;
  name: string;
  selectExpression: string;
}

interface PageRegionProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  data?: TableListData<PageRegionListItem>;
}

@connect(({ loading }: { loading: { models: { [key: string]: boolean } } }) => ({
  loading: loading.models.ruleConf,
}))
class PageRegion extends PureComponent<PageRegionProps> {
  columns: StandardTableColumnProps<PageRegionListItem>[] = [
    {
      title: '区域表达式',
      dataIndex: 'selectExpression',
    },
    {
      title: '区域名称',
      dataIndex: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
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
            element={
              <a>
                <Icon type="edit" />
                <FormattedMessage id="component.common.text.edit" />
              </a>
            }
            formItems={pageRegionFormItems}
            formValues={record}
            onSubmit={this.handleEdit}
          />
        </>
      ),
    },
  ];

  handleEdit = (fields: any) => this.handleAddOrEdit('ruleConf/modify', fields);

  handleAddOrEdit = (type: string, fields: any) => {
    const { dispatch } = this.props;
    return dispatch({
      type,
      payload: fields,
      // @ts-ignore
    }).then(() => {
      message.success(
        formatMessage({
          id: `component.common.text.${(type.indexOf('create') !== -1 && 'add') || 'edit'}-success`,
        }),
      );
    });
  };

  render() {
    const { data } = this.props;

    return <StandardTable<PageRegionListItem> columns={this.columns} data={data} />;
  }
}

export default PageRegion;
