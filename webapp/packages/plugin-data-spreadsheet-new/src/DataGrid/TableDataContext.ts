/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { createContext } from 'react';
import type { Column } from 'react-data-grid';

import type { SqlResultColumn } from '@cloudbeaver/core-sdk';

export interface ITableData {
  columns: Array<Column<any[], any>>;
  rows: any[][];
  getColumnInfo: (key: string | number) => SqlResultColumn | undefined;
  getColumnsInRange: (startIndex: number, endIndex: number) => Array<Column<any[], any>>;
  getColumnIndexFromKey: (columnKey: string | number) => number;
  isIndexColumn: (columnKey: string) => boolean;
  isIndexColumnInRange: (columnsRange: Array<Column<any[], any>>) => boolean;
  getColumnKeyFromColumnIndex: (columnIndex: number) => string;
  getColumnsWithoutIndex: () => Array<Column<any[], any>>;
}

export const TableDataContext = createContext<ITableData | null>(null);
