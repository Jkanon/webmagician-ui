import { TableListItem } from '@/components/StandardTable';
import { Component } from 'react';

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData<T extends TableListItem> {
  list: T[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  pageSize: number;
  currentPage: number;
}
