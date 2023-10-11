import injectedModule from '@web3-onboard/injected-wallets';
import { init, useConnectWallet } from '@web3-onboard/react';
import { useState } from 'react';
import { Close } from './Close';
import { Hamburger } from './Hamburger';
import { SendTransaction } from './SendTransactionModal';

init({
  // The "injectedModule()" was missing here which prevented wallet connection (TASK #2)
  wallets: [injectedModule()],
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

/**
 * Navigation bar for the app, contains a button to connect and disconnect a user's
 * wallet and also includes a "Send Transaction" button when a wallet is connected.
 */
export const Navigation = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  // Since autoConnectLastWallet is true above, that means the last wallet
  // connected will be saved to localhost.
  const previousWallet = (
    JSON.parse(localStorage.getItem(WALLET_LOCAL_STORAGE_KEY) as string) as string[]
  )?.[0];

  // If there is a previous wallet but no locally wallet that means it's loading, for some
  // reason this is not picked up in the "connecting" variable from useConnectWallet().
  const isLoading = (!wallet && previousWallet) || connecting;

  /** Attempts to connect the user's wallet. */
  const handleConnect = () => {
    connect();
  };

  /** Disconnects the user's wallet. */
  const handleDisconnect = () => {
    wallet && disconnect(wallet);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  // Refactored the styling for the navigation and added a mobile  menu for the buttons
  // on mobile screen resolutions(TASK #6)
  return (
    <header className="flex bg-gray-800 fixed w-full h-20 top-0">
      <nav className="max-w-[85rem] w-full mx-auto flex items-center justify-between gap-2 p-4">
        <div className="flex items-center justify-between">
          <a className="flex-none text-xl font-semibold dark:text-white" href=".">
            Transactions List
          </a>
        </div>
        <div>
          <div className="sm:hidden" onClick={() => setMenuOpen(prev => !prev)}>
            {menuOpen ? (
              <Close className="text-white w-8 h-8 cursor-pointer" />
            ) : (
              <Hamburger className="text-white w-8 h-8 cursor-pointer" />
            )}
          </div>
          <div
            className={`${
              menuOpen ? 'block' : 'hidden'
            } fixed h-screen w-full bg-gray-800 left-0 sm:flex p-4 pt-10 flex flex-col sm:flex-row gap-4 sm:static sm:justify-end sm:items-center sm:gap-4 sm:h-[initial] sm:w-[initial] sm:p-[initial]`}
          >
            {wallet && <SendTransaction />}
            <button
              type="button"
              onClick={wallet ? handleDisconnect : handleConnect}
              className="w-full sm:w-[160px] py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 hover:text-white hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-sm"
            >
              {isLoading ? 'Loading' : wallet ? 'Disconnect Wallet' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
