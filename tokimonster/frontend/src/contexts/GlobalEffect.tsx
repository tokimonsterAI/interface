import {useAutoClearExpiredCacheEffect} from '@shared/fe/hook/use-local-storage';

const GlobalEffect: React.FCD = ({children}) => {
    useAutoClearExpiredCacheEffect();

    return <>{children}</>;
};

export default GlobalEffect;
