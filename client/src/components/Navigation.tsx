import injectedModule from '@web3-onboard/injected-wallets';
import { init, useConnectWallet } from '@web3-onboard/react';
import { SendTransaction } from './SendTransactionModal';

const injected = injectedModule();

init({
  wallets: [injected],
  chains: [
    {
      id: '123456',
      token: 'ETH',
      label: 'Local Ganache',
      rpcUrl: 'http://localhost:8545',
    },
  ],
  connect: {
    autoConnectLastWallet: true,
  },
});

/** This will be stored as a string array in local storage e.g: ["MetaMask"] */
const WALLET_LOCAL_STORAGE_KEY = 'onboard.js:last_connected_wallet';

const Navigation = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  // Since autoConnectLastWallet is true above, that means the last wallet
  // connected will be saved to localhost.
  const previousWallet = (
    JSON.parse(localStorage.getItem(WALLET_LOCAL_STORAGE_KEY) as string) as string[]
  )?.[0];

  // If there is a previous wallet but no wallet locally that means it's loading, for some
  // reason this is not picked up in the "connecting" variable from useConnectWallet().
  const isLoading = (!wallet && previousWallet) || connecting;

  /** Attempts to connect the user's wallet. */
  const handleConnect = () => {
    connect();
  };

  /** Disconnects the user's wallet. */
  const handleDisconnect = async () => {
    wallet && disconnect(wallet);
  };

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-ful text-sm py-4 bg-gray-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <a className="flex-none text-xl font-semibold dark:text-white" href=".">
            Transactions List
          </a>
        </div>
        <div className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
            {wallet && <SendTransaction />}
            <button
              type="button"
              onClick={wallet ? handleDisconnect : handleConnect}
              className="w-[160px] py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 hover:text-white hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-sm"
            >
              {isLoading ? 'Loading' : wallet ? 'Disconnect Wallet' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
