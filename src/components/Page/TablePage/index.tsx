import React, { Component, RefObject } from 'react';
import ReactDOM from 'react-dom';
import { Dispatch } from 'redux';

import { Card, Modal } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { ExpandIconProps, PaginationConfig, SorterResult } from 'antd/es/table';
import { TableLocale } from 'antd/es/table/interface';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TransButton from 'antd/es/_util/transButton';
import LocaleReceiver from 'antd/es/locale-provider/LocaleReceiver';
import defaultLocale from 'antd/es/locale/default';
import { formatMessage } from 'umi-plugin-react/locale';
import classNames from 'classnames';
import RouteContext from '@ant-design/pro-layout/es/RouteContext';

import StandardTable, { StandardTableColumnProps, TableListItem } from '@/components/StandardTable';
import SearchPanel from './SearchPanel';
import OperatorPanel from './OperatorPanel';

import styles from './index.less';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

export interface TableListPagination extends PaginationConfig {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData<T extends TableListItem> {
  list: T[];
  pagination?: Partial<TableListPagination> | false;
}

export interface TableListParams {
  sorter: string;
  status: string;
  pageSize: number;
  currentPage: number;
}

interface TablePageProps<T extends TableListItem> {
  dispatch: Dispatch<any>;
  loading: boolean;
  // action of searching page list
  action?: string;
  searchParams?: any;
  columns: StandardTableColumnProps<T>[];
  data: TableListData<T>;
  selectedRows?: T[];
  searchFormValues?: any;
  pageHeader?: boolean;
  title?: string;
  tableOptions?: any;
  batchDelete: boolean;
  handleSelectRows?: (rows: T[]) => void;
  onDelete?: (rows: T[]) => void;
  searchFormRender?: (form: WrappedFormUtils) => React.ReactNode;
  operatorRender?: () => React.ReactNode;
  expandedRowRender?: (record: T) => React.ReactNode;
}

interface TablePageState<T extends TableListItem> {
  selectedRows: T[];
  searchFormValues: any;
  pagination?: Partial<TableListPagination> | false;
  filters?: any;
  sorter?: SorterResult<T>;
  // 选中的显示行
  selectedDisplayColumnsKey?: string[];
  tableMaxHeight?: number;
}

const defaultPagination = {
  pageSize: 10,
  current: 1,
};

class TablePage<T extends TableListItem> extends Component<TablePageProps<T>, TablePageState<T>> {
  // @ts-ignore
  private tableRef: RefObject<StandardTable> = React.createRef();

  private isMobile?: boolean;

  static defaultProps = {
    batchDelete: true,
    data: {
      list: [],
      pagination: defaultPagination,
    },
  };

  constructor(props: TablePageProps<T>) {
    super(props);
    const pagination =
      typeof props.data.pagination === 'boolean'
        ? props.data.pagination
        : {
            ...defaultPagination,
            ...props.data.pagination,
          };
    this.state = {
      selectedRows: props.selectedRows || [],
      searchFormValues: props.searchFormValues || {},
      pagination,
    };
  }

  componentDidMount() {
    this.doSearch();
    if (this.tableRef) {
      // eslint-disable-next-line react/no-find-dom-node
      const standardTableDom = ReactDOM.findDOMNode(this.tableRef.current);
      if (standardTableDom) {
        // @ts-ignore
        const el = standardTableDom.querySelector('.ant-table-tbody');
        if (el) {
          if (this.isMobile === true) {
            this.setState({
              tableMaxHeight: undefined,
            });
          } else {
            // TODO 尺寸可能得跟着表格尺寸进行调整
            let height: number | undefined =
              window.innerHeight - el.getBoundingClientRect().top - 96;
            height = height > 50 ? height : 50;
            this.setState({
              tableMaxHeight: height,
            });
          }
        }
      }
    }
  }

  componentDidUpdate(
    prevProps: Readonly<TablePageProps<T>>,
    prevState: Readonly<TablePageState<T>>,
    snapshot?: any,
  ): void {
    const { data: { list: preList } = { list: [] } } = prevProps;
    const { data: { list } = { list: [] } } = this.props;
    if (
      this.tableRef &&
      this.state.tableMaxHeight &&
      // 高度变化
      (prevState.tableMaxHeight !== this.state.tableMaxHeight ||
        // 数据变化
        (preList.length !== list.length && (preList.length === 0 || list.length === 0)))
    ) {
      // eslint-disable-next-line react/no-find-dom-node
      const standardTableDom = ReactDOM.findDOMNode(this.tableRef.current);
      if (standardTableDom) {
        // @ts-ignore
        const el = standardTableDom.querySelector('.ant-table-placeholder');

        if (el) {
          // TODO 尺寸可能得跟着表格尺寸进行调整
          el.style.height = `${this.state.tableMaxHeight + 48}px`;
        }
      }
    }
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof T, string[]>,
    sorter: SorterResult<T>,
  ) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    this.setState(
      {
        pagination: {
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
        filters,
        sorter,
      },
      this.doSearch,
    );
  };

  /**
   * Callback after selecting/unselecting rows
   * @param rows
   */
  handleSelectRows = (rows: T[]) => {
    this.setState(
      {
        selectedRows: rows,
      },
      () => {
        const { handleSelectRows } = this.props;
        if (handleSelectRows) {
          handleSelectRows(rows);
        }
      },
    );
  };

  /**
   * Search Hanlder
   * @param e
   */
  onSearch = (fieldsValue: any) => {
    // TODO 添加格式化
    const values = {
      ...fieldsValue,
    };

    const { pagination } = this.state;

    this.setState(
      {
        searchFormValues: values,
        pagination: {
          // @ts-ignore
          ...pagination,
          current: 1,
        },
      },
      this.doSearch,
    );
  };

  onSearchReset = () => {
    this.setState(
      {
        searchFormValues: {},
      },
      this.doSearch,
    );
  };

  onBatchDelete = () => {
    const { selectedRows } = this.state;
    const { onDelete } = this.props;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: formatMessage(
        { id: 'component.common.text.delete-items' },
        { count: selectedRows.length },
      ),
      okType: 'danger',
      onOk() {
        if (onDelete) {
          onDelete(selectedRows);
        }
      },
      onCancel() {},
    });
  };

  onSelectedDisplayColumnKeyChange = (selectedDisplayColumnsKey: string[]) => {
    this.setState({ selectedDisplayColumnsKey });
  };

  doSearch = () => {
    const { action, dispatch, searchParams = {} } = this.props;
    const { searchFormValues, pagination, filters, sorter } = this.state;
    const params: Partial<TableListParams> = {
      // @ts-ignore
      currentPage: pagination.current,
      // @ts-ignore
      pageSize: pagination.pageSize,
      ...searchParams,
      ...searchFormValues,
      ...filters,
    };
    if (sorter && sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    if (dispatch && action) {
      dispatch({
        type: action,
        payload: params,
        // @ts-ignore
      }).catch(err => {
        console.error(err);
      });
    }
  };

  expandIcon = ({
    expanded,
    expandable,
    record,
    needIndentSpaced,
    onExpand,
  }: ExpandIconProps<T>) => {
    const prefixCls = 'ant-table';
    if (expandable) {
      const { expandedRowRender } = this.props;
      if (expandedRowRender && expandedRowRender(record) == null) {
        return null;
      }
      return (
        <LocaleReceiver componentName="Table" defaultLocale={defaultLocale.Table}>
          {(locale: TableLocale) => (
            <TransButton
              className={classNames(`${prefixCls}-row-expand-icon`, {
                [`${prefixCls}-row-collapsed`]: !expanded,
                [`${prefixCls}-row-expanded`]: expanded,
              })}
              onClick={event => {
                onExpand(record, event);
              }}
              aria-label={expanded ? locale.collapse : locale.expand}
              noStyle
            />
          )}
        </LocaleReceiver>
      );
    }

    if (needIndentSpaced) {
      return <span className={`${prefixCls}-row-expand-icon ${prefixCls}-row-spaced`} />;
    }

    return null;
  };

  renderSearchPanel() {
    const { searchFormRender } = this.props;
    return (
      searchFormRender && (
        <SearchPanel
          onSearch={this.onSearch}
          onReset={this.onSearchReset}
          searchFormRender={searchFormRender}
        />
      )
    );
  }

  renderOperatorPanel() {
    const { operatorRender, columns, batchDelete } = this.props;
    const { selectedRows } = this.state;

    return (
      operatorRender && (
        <OperatorPanel
          columns={columns}
          selectedRows={selectedRows}
          batchDelete={batchDelete}
          onBatchDelete={this.onBatchDelete}
          onSearch={this.doSearch}
          operatorRender={operatorRender}
          onSelectedDisplayColumnKeyChange={this.onSelectedDisplayColumnKeyChange}
        />
      )
    );
  }

  renderTableList() {
    const { loading, data, expandedRowRender, tableOptions = {}, columns } = this.props;
    const { selectedRows, selectedDisplayColumnsKey, tableMaxHeight } = this.state;
    const displayColumns =
      selectedDisplayColumnsKey === undefined
        ? columns
        : columns.filter(
            (item, index) =>
              selectedDisplayColumnsKey.indexOf((item.key || item.dataIndex || index).toString()) >=
              0,
          );

    const { scroll = {}, bodyStyle, ...rest } = tableOptions;
    const tableOpts = {
      size: 'small',
      bordered: true,
      ...rest,
      scroll: {
        y: tableMaxHeight,
        x:
          (scroll && scroll.x) ||
          (scroll !== false && scroll && scroll.x !== false && 'max-content'),
      },
      bodyStyle: {
        ...bodyStyle,
        height: data && data.list && data.list.length > 0 && tableMaxHeight,
      },
      expandIcon: this.expandIcon,
    };
    return (
      <StandardTable
        ref={this.tableRef}
        selectedRows={selectedRows}
        loading={loading}
        data={data}
        columns={displayColumns}
        expandedRowRender={expandedRowRender}
        onSelectRow={this.handleSelectRows}
        onChange={this.handleStandardTableChange}
        {...tableOpts}
      />
    );
  }

  renderPage() {
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <RouteContext.Consumer>
            {({ isMobile }) => {
              this.isMobile = isMobile;
              return (
                <>
                  {this.renderSearchPanel()}
                  {this.renderOperatorPanel()}
                  {this.renderTableList()}
                </>
              );
            }}
          </RouteContext.Consumer>
        </div>
      </Card>
    );
  }

  render() {
    const { title, pageHeader } = this.props;

    if (pageHeader) {
      return <PageHeaderWrapper title={title}>{this.renderPage()}</PageHeaderWrapper>;
    }
    return this.renderPage();
  }
}

export default TablePage;
