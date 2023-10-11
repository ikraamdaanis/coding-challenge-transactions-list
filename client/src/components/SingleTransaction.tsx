import { useQuery } from '@apollo/client';
import { ethers } from 'ethers';
import { GetSingleTransaction } from '../queries';
import { SingleTransactionData } from '../types';
import { navigate } from './NaiveRouter';
import { ReactNode } from 'react';

interface SingleTransactionProps {
  id: string | null;
}

/**
 * This component displays the details of a single Ethereum transaction. Includes the
 * transaction hash, sender address, recipient address, and amount in Ether (ETH).
 */
export const SingleTransaction = ({ id }: SingleTransactionProps) => {
  const handleGoBack = () => navigate(`/transactions`);

  const { loading, error, data } = useQuery<SingleTransactionData>(GetSingleTransaction, {
    variables: { hash: id },
  });

  const { hash, to, from, value } = data?.getTransaction || {};

  // Converting WEI to ETH so it's readable and rounding it to 2 decimal places (TASK #7)
  const ethValue = Number(ethers.formatEther(value || '0').toString());

  const Container = ({ children }: { children: ReactNode }) => {
    return (
      <>
        <div className="flex flex-col mt-20">
          <div className="max-w-[85rem] w-full mx-auto p-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <button
                onClick={handleGoBack}
                type="button"
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
        <div className="mt-0 p-4 max-w-[85rem] mx-auto">
          <h1 className="text-2xl mb-4 font-semibold">Transaction Details</h1>
          {children}
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="shadow-sm p-4 border rounded-sm bg-zinc-200 animate-pulse min-h-[154px]" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="bg-red-100 p-4 border border-red-600 rounded-sm">
          Error: {error.message}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="w-full mx-auto p-4 bg-white border-zinc-200 rounded-sm border flex flex-col gap-2">
        <p className="break-words">
          <span className="font-semibold inline-block w-full min-w-[10rem] sm:w-[25%]">
            Transaction Hash:{' '}
          </span>
          <span className="break-words">{hash}</span>
        </p>
        <p className="break-words">
          <span className="font-semibold inline-block min-w-[10rem] sm:w-[25%]">
            Sender Address:{' '}
          </span>
          <span className="text-blue-600">{from}</span>
        </p>
        <p className="break-words">
          <span className="font-semibold inline-block min-w-[10rem] sm:w-[25%]">
            Recipient Address:{' '}
          </span>
          <span className="text-blue-600">{to}</span>
        </p>
        <p className="break-words">
          <span className="font-semibold inline-block min-w-[10rem] sm:w-[25%]">Amount: </span>
          <span>{ethValue} ETH</span>
        </p>
      </div>
    </Container>
  );
};
