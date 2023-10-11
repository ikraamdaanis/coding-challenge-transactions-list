import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GetAllTransactions } from '../queries';
import { Transaction, TransactionsData } from '../types';
import { navigate } from './NaiveRouter';
import { ethers } from 'ethers';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { loading, error, data } = useQuery<TransactionsData>(GetAllTransactions);

  useEffect(() => {
    if (data && data.getAllTransactions) {
      setTransactions(data.getAllTransactions);
    }
  }, [data]);

  const handleNavigate = (hash: string) => navigate(`/transaction/${hash}`);

  if (loading) {
    return (
      <div className="flex flex-col mt-20">
        <div className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col mt-20">
        <div className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between text-red-600 font-bold">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-20">
      <div className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <div className="p-1.5 min-w-full inline-block align-middle">
          {!!transactions.length ? (
            <>
              {transactions.map(({ hash, to, from, value }) => {
                // Converting WEI to ETH so it's readable and rounding it to 2 decimal places (TASK #7)
                const ethValue = Number(ethers.formatEther(value).toString());

                return (
                  <div
                    key={hash}
                    className="bg-white shadow-sm p-4 md:p-5 border rounded border-gray-300 mt-3 hover:border-blue-500 cursor-pointer"
                    onClick={() => handleNavigate(hash)}
                    title={`${ethValue} ETH`}
                  >
                    <span className="font-bold">{ethValue.toFixed(2)} ETH</span> sent from{' '}
                    <span className="font-bold">{from}</span> to{' '}
                    <span className="font-bold">{to}</span>
                  </div>
                );
              })}
            </>
          ) : (
            <p>No transactions available yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
