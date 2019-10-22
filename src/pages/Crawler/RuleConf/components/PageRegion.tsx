import React, { PureComponent } from 'react';
import { Dispatch } from 'redux';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Divider, Icon, message, Tabs } from 'antd';
import StandardTable, { StandardTableColumnProps, TableListItem } from '@/components/StandardTable';
import { TableListData } from '@/components/Page/TablePage';
import { ModalForm } from '@/components/Form';
import InlineModal from '@/components/Modal/InlineModal';
import pageRegionFormItems from './PageRegionFormItems';
import RegionFields from './RegionFields';
import RegionLinks from './RegionLinks';
import { PageInfoListItem } from '@/pages/Crawler/RuleConf/models/ruleConf';

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
          <InlineModal
            title={formatMessage({ id: 'component.common.text.detail' })}
            element={
              <a>
                <Icon type="info-circle" />
                <FormattedMessage id="component.common.text.detail" />
              </a>
            }
            fullScreen
            maxmin={false}
            footer={false}
            destroyOnClose
          >
            <Tabs tabPosition="left">
              <Tabs.TabPane
                tab={formatMessage({ id: 'app.crawler.rule-conf.label.region.fields' })}
                key="1"
              >
                <RegionFields regionId={record.id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={formatMessage({ id: 'app.crawler.rule-conf.label.region.links' })}
                key="2"
              >
                <RegionLinks regionId={record.id} />
              </Tabs.TabPane>
            </Tabs>
          </InlineModal>
          <Divider type="vertical" />
          <ModalForm
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
    // @ts-ignore
    return <StandardTable columns={this.columns} data={data} />;
  }
}

export default PageRegion;
