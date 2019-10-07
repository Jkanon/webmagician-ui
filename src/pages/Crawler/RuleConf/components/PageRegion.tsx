import React, { PureComponent } from 'react';
import { Dispatch } from 'redux';
import StandardTable, { StandardTableColumnProps, TableListItem } from '@/components/StandardTable';
import { TableListData } from '@/components/Page/TablePage';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Icon, message } from 'antd';
import { ModalForm } from '@/components/Form';
import pageRegionFormItems from './PageRegionFormItems';
import { PageInfoListItem } from '@/pages/Crawler/RuleConf/model';

export interface PageRegionListItem extends TableListItem {
  id: string;
  name: string;
  selector: string;
  pageInfo?: PageInfoListItem;
}

interface PageRegionProps {
  dispatch: Dispatch<any>;
  data?: TableListData<PageRegionListItem>;
}

class PageRegion extends PureComponent<PageRegionProps> {
  columns: StandardTableColumnProps<PageRegionListItem>[] = [
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.selector" />,
      dataIndex: 'selector',
    },
    {
      title: <FormattedMessage id="app.crawler.rule-conf.label.region.name" />,
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="app.common.label.memo" />,
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

  handleAdd = (fields: any) => this.handleAddOrEdit('ruleConf/createPageRegion', fields);

  handleEdit = (fields: any) => this.handleAddOrEdit('ruleConf/modifyPageRegion', fields);

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
