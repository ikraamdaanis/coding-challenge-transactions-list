import { zodResolver } from '@hookform/resolvers/zod';
import { useConnectWallet } from '@web3-onboard/react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as z from 'zod';
import { RootState } from '../store/reducers';
import { Actions } from '../types';
import { useEffect } from 'react';

const sendTransactionSchema = z.object({
  sender: z.string().min(1, { message: 'Required' }),
  recipient: z.string(),
  amount: z.number().min(1),
});

export type SendTransactionSchema = z.infer<typeof sendTransactionSchema>;

/**
 * Form for initiating an Ethereum transaction.The form allows users to specify
 * sender, recipient, and the amount to send in an Ethereum transaction. (TASK #5)
 */
export const SendTransactionForm = () => {
  const dispatch = useDispatch();

  const [{ wallet }] = useConnectWallet();

  const form = useForm({
    resolver: zodResolver(sendTransactionSchema),
    defaultValues: {
      sender: wallet?.accounts?.[0].address || '',
      recipient: '',
      amount: 1,
    },
    values: {
      sender: wallet?.accounts?.[0].address || '',
      recipient: '',
      amount: 1,
    },
  });

  const onSubmit = (data: SendTransactionSchema) => {
    dispatch({ type: Actions.SendTransactionRequested, payload: data });
  };

  const error = useSelector((state: RootState) => state.error);
  const transactionCreated = useSelector((state: RootState) => state.transactionCreated);

  // Resets the form inputs when a transaction is created.
  useEffect(() => {
    if (transactionCreated) {
      form.reset();
    }
  }, [form, transactionCreated]);

  return (
    <FormProvider {...form}>
      <form className="p-4 overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
        <p className="mt-1 mb-6 text-gray-800">Send ETH to a wallet address</p>
        <label htmlFor="input-sender" className="block text-sm font-bold my-2">
          Sender (Autocompleted):
        </label>
        <input
          type="text"
          id="input-sender"
          className="opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full disabled:opacity-40"
          placeholder="Sender Address (Autocompleted)"
          {...form.register('sender')}
          disabled
        />
        <label htmlFor="input-recipient" className="block text-sm font-bold my-2">
          Recipient:
        </label>
        <input
          type="text"
          id="input-recipient"
          className="opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
          placeholder="Recipient Address"
          required
          {...form.register('recipient')}
        />
        <label htmlFor="input-amount" className="block text-sm font-bold my-2">
          Amount (ETH):
        </label>
        <input
          type="number"
          id="input-amount"
          className="opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
          placeholder="Amount"
          step="any"
          min={1}
          {...form.register('amount', { valueAsNumber: true })}
        />
        {error && (
          <div className="bg-red-100 p-4 border border-red-600 rounded-sm mt-4">
            <p className="line-clamp-3">
              <b>Error: </b>
              {error}
            </p>
          </div>
        )}
        <div className="flex justify-end items-center gap-x-2 pt-4">
          <button
            type="button"
            className="hs-dropdown-toggle py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
            data-hs-overlay="#hs-basic-modal"
          >
            Close
          </button>
          <button
            type="submit"
            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
          >
            Send
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
