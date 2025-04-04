import {createContext, useContext} from 'react';

import {getTimer} from '@shared/fe/util/debugger';

import {ConfigContextType, initialConfigContext, useConfigContextProvider} from './ConfigContext';
import {DbUserContextType, initialDbUserContext, useDbUserContextProvider} from './DbUserContext';
import {WalletContextType, initialWalletContext, useWalletContextProvider} from './WalletContext';

type GlobalContextType = {
    initialized?: boolean // use to check wrong dependencies

    // core layer
    walletContext: WalletContextType
    dbUserContext: DbUserContextType

    // 1st layer
    configContext: ConfigContextType

    // 2nd layer
}

const initialContext: GlobalContextType = {
    // core layer
    walletContext: initialWalletContext,
    dbUserContext: initialDbUserContext,

    // 1st layer
    configContext: initialConfigContext,

    // 2nd layer
};

export const GlobalContext = createContext<GlobalContextType>(initialContext);

export function useGlobalContextProvider(): GlobalContextType {
    const timer = getTimer('useGlobalContextProvider');
    timer.start();

    // core layer
    const walletContext = useWalletContextProvider();
    const dbUserContext = useDbUserContextProvider();
    timer.log('core layer');

    // 1st layer
    const configContext = useConfigContextProvider();
    timer.log('1st layer');

    // 2nd layer context: depends on only 1st layer contexts
    timer.log('2nd layer');
    timer.end();

    return {
        initialized: true,

        // core layer
        walletContext,
        dbUserContext,

        // 1st layer
        configContext,

        // 2nd layer
    };
}

export const GlobalCoreContextProvider: React.FCD = ({children}) => {
    const globalContext = useGlobalContextProvider();

    return (
        <GlobalContext.Provider value={globalContext}>
            {children}
        </GlobalContext.Provider>
    );
};

// define top-level shortcut hooks here, other derived shortcuts should be placed in src/hooks/global-context/derived

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context.initialized) {
        // prevent other global context use all the below hooks
        throw new Error('GlobalContext is not initialized. You can NOT useGlobalContext() within useGlobalContextProvider()!');
    }

    return context;
};

// core layer
export const useWalletContext = () => useGlobalContext().walletContext;
export const useDbUserContext = () => useGlobalContext().dbUserContext;

// 1st layer
export const useConfigContext = () => useGlobalContext().configContext;

// 2nd layer
