import {
  BrowserProvider,
  JsonRpcProvider,
  Signer,
  Transaction,
  TransactionReceipt,
  TransactionResponse,
  ethers,
} from 'ethers';
import { put, takeEvery } from 'redux-saga/effects';

import apolloClient from '../apollo/client';
import { navigate } from '../components/NaiveRouter';
import { SaveTransaction } from '../queries';
import { Actions } from '../types';

function* sendTransaction() {
  const provider = new JsonRpcProvider('http://localhost:8545');

  // this could have been passed along in a more elegant fashion,
  // but for the purposes of this scenario it's good enough
  // @ts-ignore
  const walletProvider = new BrowserProvider(window.web3.currentProvider);

  const signer: Signer = yield walletProvider.getSigner();

  const accounts: Array<{ address: string }> = yield provider.listAccounts();

  const randomAddress = () => {
    const min = 1;
    const max = 19;
    const random = Math.round(Math.random() * (max - min) + min);
    return accounts[random].address;
  };

  const transaction = {
    to: randomAddress(),
    value: ethers.parseEther('2'), // This needs to be a bigint type, not number (TASK #3)
  };

  try {
    const txResponse: TransactionResponse = yield signer.sendTransaction(transaction);
    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || '0',
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || '0',
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || '',
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || '123456',
        hash: receipt.hash,
      },
    };

    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });

    yield put({ type: Actions.SendTransactionSucceeded, payload: variables.transaction });

    // Navigating to the new transaction's individual page (TASK #4)
    navigate(`/transaction/${receipt.hash}`);
  } catch (error) {
    console.error(Actions.SendTransaction, error);
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}
