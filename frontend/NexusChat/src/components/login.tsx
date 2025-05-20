import { useEffect, useState } from 'react';
import { ConnectModal, useConnectWallet, useCurrentAccount, useDisconnectWallet, useWallets } from '@mysten/dapp-kit';
import { UserProviderType } from '../Models/UserProvider';
import { useUser } from '../Context/UserProvider';
import { ValidateClient } from '../services/LoginService';
import { executeCreateUser, signTransaction } from '../services/TransactionService';

const Login = (props: { active: boolean; onPopUpChange: (newState: boolean) => void }) => {
    const isOpen = props.active;
    const [popUp, setPopUp] = useState(false);
    const userProvider: UserProviderType = useUser();
    const currentAccount = useCurrentAccount();
    const [open, setOpen] = useState(false);
    const { mutate: disconnect } = useDisconnectWallet();

    const wallets = useWallets();
    const { mutate: connect } = useConnectWallet();

    useEffect(() => {
        if (popUp) props.onPopUpChange(popUp);
    }, [popUp, props]);

    useEffect(() => {
        if (currentAccount && userProvider.token == null) {
            handleConnection();
        }
    }, [currentAccount]);

    useEffect(() => {
        if (userProvider.user && currentAccount == null) {
            wallets.map((wallet) => (
                connect(
                    { wallet },
                    {
                        onSuccess: () => console.log('connected'),
                    },
                )
            ))
        }
    }, [userProvider.user]);

    const handleConnectModal = ((flag: boolean) => {
        setOpen(flag);
        setPopUp(flag);

    });

    const handleConnection = async () => {
        if (currentAccount?.address) {
            let clientResponse = await ValidateClient(currentAccount?.address);
            if (clientResponse.exists) {
                userProvider.login(clientResponse.token, clientResponse.user);
            } else {
                const transactionUserData = await signTransaction(clientResponse.txBytes);
                const transactionUserDataResponse = await executeCreateUser(transactionUserData, currentAccount.address);
                userProvider.login(transactionUserDataResponse?.token, transactionUserDataResponse?.user);
            }
        }
    };

    const handleDisconnect = () => {
        disconnect();
        userProvider.logout();
    };

    return (
        <div>
            {/* Connect Button */}
            <div className={`${!isOpen && 'lg:hidden'} ${currentAccount ? 'hidden' : 'block'} w-full bg-dark-900 text-dark-200 text-sm ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400`}>
                <ConnectModal trigger={<button className="px-4 py-2 lg:px-6 lg:py-3" disabled={!!currentAccount}>Connect</button>} open={open} onOpenChange={(flag) => { handleConnectModal(flag) }} /></div>

            {/* Disconnect Button */}
            <div className={`${!isOpen && 'lg:hidden'} ${currentAccount ? 'block' : 'hidden'} w-full bg-dark-900 text-dark-200 text-sm ring-1 ring-dark-600 hover:ring-2 hover:ring-dark-300 duration-300 rounded-xl hover:shadow-[0px_0px_20px_5px_rgba(128,128,128,1)] shadow-md active:shadow-2xl active:shadow-dark-400`}>
                <button onClick={() => handleDisconnect()} className="px-4 py-2 lg:px-6 lg:py-3">Disconnect</button></div>

            {/* Connect SVG */}
            <div className={`p-1 bg-dark-600 rounded-xl hidden ${!isOpen && !currentAccount && 'lg:block'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
            </div>

            {/* Disconnect SVG */}
            <div className={`p-1 bg-dark-600 rounded-xl hidden ${!isOpen && currentAccount && 'lg:block'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
            </div>
        </div>

    );
};

export default Login;
