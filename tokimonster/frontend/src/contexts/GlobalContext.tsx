import {GlobalCoreContextProvider} from './global-core';
import {GlobalRootContextProvider} from './global-root';
import GlobalEffect from './GlobalEffect';

export const GlobalContextProvider: React.FCD = ({children}) => {
    return (
        <GlobalRootContextProvider>
            <GlobalCoreContextProvider>
                <GlobalEffect>
                    {children}
                </GlobalEffect>
            </GlobalCoreContextProvider>
        </GlobalRootContextProvider>
    );
};

export * from './global-core';
export {useAccountContext} from '@shared/fe/context/AccountContext';
