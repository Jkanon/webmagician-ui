import React, { Component } from 'react';
import { Alert, Form, Table } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';

import { FormattedMessage } from 'umi-plugin-react/locale';
import { FormComponentProps } from 'antd/es/form';
import { WrappedFormUtils } from 'antd/es/form/Form';

import EditableCell from './EditableCell';

import styles from './index.less';

export interface TableListItem {
  id?: number | string;
  disabled?: boolean;
  editing?: boolean;
}

export interface StandardTableColumnProps<T> extends ColumnProps<T> {
  editable?: boolean;
  editingRender?: (
                    text: any,
                    record: any,
                    index: number,
                    form: WrappedFormUtils,
                  )=> React.ReactNode;
  needTotal?: boolean;
  total?: number;
}

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'>, FormComponentProps {
  columns: StandardTableColumnProps<T>[];
  data?: {
    list: T[];
    pagination?: StandardTableProps<T>['pagination'];
  };
  selectedRows?: T[];
  onSelectRow?: (rows: T[]) => void;
}

interface StandardTableState<T> {
  selectedRowKeys: string[];
  needTotalList: StandardTableColumnProps<T>[];
}

function initTotalList<T>(columns: StandardTableColumnProps<T>[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps<T>[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable<T extends TableListItem> extends Component<
  StandardTableProps<T>,
  StandardTableState<T>
> {
  static getDerivedStateFromProps<T>(nextProps: StandardTableProps<T>) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<T>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange: TableRowSelection<T>['onChange'] = (
    selectedRowKeys,
    selectedRows: T[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  handleTableChange: TableProps<T>['onChange'] = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { form, columns, data, rowKey, onSelectRow, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number, range: [number, number]) => (
        <FormattedMessage
          id="component.pagination.total"
          values={{ range0: range[0], range1: range[1], total }}
        />
      ),
      ...pagination,
    };

    const { scroll } = this.props;
    let scrollX = false;
    if (scroll && scroll.x) {
      scrollX = true;
    }
    const rowSelection: TableRowSelection<T> = {
      fixed: scrollX,
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record: T) => ({
        disabled: record.disabled,
      }),
    };

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const wrappedColumns = columns.map(col => {
      if (col.editable === false) {
        return col;
      }
      return {
        ...col,
        onCell: (record: T) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: record.editing,
          editingRender: col.editingRender,
          form,
        }),
      };
    });

    return (
      <div className={styles.standardTable}>
        {onSelectRow && (
          <div className={styles.tableAlert}>
            <Alert
              message={
                <>
                  <FormattedMessage
                    id="component.standardTable.items.selected"
                    values={{ count: <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> }}
                  />
                  {needTotalList.map((item, index) => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}
                      总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total, item as any, index) : item.total}
                      </span>
                    </span>
                  ))}
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    <FormattedMessage id="component.standardTable.items.clear" />
                  </a>
                </>
              }
              type="info"
              showIcon
            />
          </div>
        )}
        <Table
          rowKey={rowKey || 'id'}
          rowSelection={onSelectRow && rowSelection}
          dataSource={list}
          pagination={pagination ? paginationProps : false}
          components={components}
          columns={wrappedColumns}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default Form.create<StandardTableProps<any>>()(StandardTable);
