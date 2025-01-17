export interface Transaction {
  gasLimit: string;
  gasPrice: string;
  to: string;
  from: string;
  value: string;
  data?: string;
  chainId: string;
  hash: string;
}

export interface TransactionsData {
  getAllTransactions: Transaction[];
}

export interface SingleTransactionData {
  getTransaction: Transaction;
}

export type Action<P> = {
  type: Actions;
  payload: P;
};

export enum Actions {
  SendTransactionRequested = 'SEND_TRANSACTION_REQUESTED',
  SendTransactionSucceeded = 'SEND_TRANSACTION_SUCCEEDED',
  SendTransactionFailed = 'SEND_TRANSACTION_FAILED',
  SendTransactionClear = 'SEND_TRANSACTION_CLEAR',
}
