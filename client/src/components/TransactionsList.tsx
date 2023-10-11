import { useQuery } from '@apollo/client';
import { ethers } from 'ethers';
import { ReactNode } from 'react';
import { GetAllTransactions } from '../queries';
import { TransactionsData } from '../types';
import { navigate } from './NaiveRouter';

/**
 * Displays a list of Ethereum transactions. Includes the transaction hashes, sender addresses,
 * recipient addresses, amounts in Ether (ETH) and links to an individual transaction page.
 */
export const TransactionList = () => {
  const { loading, error, data } = useQuery<TransactionsData>(GetAllTransactions, {
    // Refetching everytimes this page mounts so we have the most up-to-date data.
    fetchPolicy: 'network-only',
  });

  const handleNavigate = (hash: string) => navigate(`/transaction/${hash}`);

  const Container = ({ children }: { children: ReactNode }) => {
    return (
      <div className="flex flex-col mt-20">
        <div className="max-w-[85rem] w-full mx-auto p-4">{children}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <Container>
        {[...Array(4)].map((_, index) => {
          return (
            <div
              className="shadow-sm p-4 border rounded bg-zinc-200 animate-pulse min-h-[66px]"
              key={index}
            />
          );
        })}
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
      {!!data?.getAllTransactions?.length ? (
        <div className="flex flex-col gap-4">
          {data?.getAllTransactions.map(({ hash, to, from, value }) => {
            // Converting WEI to ETH so it's readable and rounding it to 2 decimal places (TASK #7)
            const ethValue = Number(ethers.formatEther(value).toString());

            return (
              <div
                key={hash}
                className="bg-white shadow-sm p-4 md:p-5 border rounded border-gray-300 hover:border-blue-500 cursor-pointer w-full break-words overflow-hidden text-ellipsis"
                onClick={() => handleNavigate(hash)}
                title={`${ethValue} ETH`}
              >
                <span className="font-bold break-words text-blue-600">
                  {ethValue.toFixed(2)} ETH
                </span>{' '}
                sent from <span className="font-bold break-words">{from}</span> to{' '}
                <span className="font-bold break-words">{to}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No transactions available yet</p>
      )}
    </Container>
  );
};
