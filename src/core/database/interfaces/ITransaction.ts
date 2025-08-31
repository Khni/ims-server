export type TransactionHandler<TTransaction> = {
  startTransaction: () => Promise<TTransaction>;
  commit: (tx: TTransaction) => Promise<void>;
  rollback: (tx: TTransaction) => Promise<void>;
};

export interface ITransactionRepository<TTransaction> {
  createTransaction<TResult>(
    callback: (tx: TTransaction) => Promise<TResult>
  ): Promise<TResult>;
}
