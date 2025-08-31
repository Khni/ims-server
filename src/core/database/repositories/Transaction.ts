import {
  ITransactionRepository,
  TransactionHandler,
} from "../interfaces/ITransaction.js";

export abstract class Transaction<TTransaction>
  implements ITransactionRepository<TTransaction>
{
  constructor(protected transactionHandler: TransactionHandler<TTransaction>) {}

  async createTransaction<TResult>(
    callback: (tx: TTransaction) => Promise<TResult>
  ): Promise<TResult> {
    const tx = await this.transactionHandler.startTransaction();
    try {
      const result = await callback(tx);
      await this.transactionHandler.commit(tx);
      return result;
    } catch (error) {
      await this.transactionHandler.rollback(tx);
      throw error;
    }
  }
}
