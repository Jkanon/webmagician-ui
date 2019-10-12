import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';

import { StandardTableColumnProps } from '@/components/StandardTable';
import { TablePage } from '@/components/Page';
import {
  RegionFieldsItem,
  RegionFieldsStateType,
} from '@/pages/Crawler/RuleConf/components/RegionFields/model';

interface RegionFieldsProps {
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface RegionFieldsState {
  selectedRows: RegionFieldsItem[];
}

class RegionFields extends Component<RegionFieldsProps, RegionFieldsState> {
  columns: StandardTableColumnProps<RegionFieldsItem>[] = [
    {
      title: '别名',
      dataIndex: 'alias',
    },
  ];

  render() {
    return <TablePage columns={this.columns} />;
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
