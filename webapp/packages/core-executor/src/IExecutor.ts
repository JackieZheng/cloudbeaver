/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import type { IExecutionContext, IExecutionContextProvider } from './IExecutionContext';
import type { IExecutorHandler } from './IExecutorHandler';
import type { IExecutorHandlersCollection } from './IExecutorHandlersCollection';

export interface IExecutor<T = unknown> {
  before: <TNext extends T>(executor: IExecutor<TNext>, map?: (data: T) => TNext) => this;
  next: <TNext extends T>(executor: IExecutor<TNext>, map?: (data: T) => TNext) => this;
  execute: (
    data: T,
    context?: IExecutionContext<T>,
    scope?: IExecutorHandlersCollection<T>
  ) => Promise<IExecutionContextProvider<T>>;
  executeScope: (
    data: T,
    scope?: IExecutorHandlersCollection<T>,
    context?: IExecutionContext<T>
  ) => Promise<IExecutionContextProvider<T>>;
  addHandler: (handler: IExecutorHandler<T>) => this;
  removeHandler: (handler: IExecutorHandler<T>) => void;
  addPostHandler: (handler: IExecutorHandler<T>) => this;
  removePostHandler: (handler: IExecutorHandler<T>) => void;
}
