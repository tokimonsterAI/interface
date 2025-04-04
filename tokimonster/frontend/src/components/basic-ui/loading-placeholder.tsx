import {styled} from '@linaria/react';

import {useContinuousLoading} from '@shared/fe/hook/use-variable-loading';

const LoadingBlock = styled.div`
    padding: 10px 30px;
    min-height: 120px;
    
    animation: alternate .6s infinite ease-in-out flash;

    @keyframes flash {
        0% {
            background-color: rgba(255, 255, 255, 0.15);
        }
        100% {
            background-color: rgba(255, 255, 255, 0.5);
        }
    }
`;

type Props = {
    loading?: boolean
    noRadius?: boolean
    placeholder?: React.ReactNode
}

const LoadingPlaceholder: React.FCD<Props> = ({loading: isLoading, noRadius, placeholder, children, ...props}) => {
    const {loading} = useContinuousLoading(isLoading);

    if (!loading) {
        return <>{children}</>;
    }

    return (
        <LoadingBlock
            sx={{borderRadius: noRadius ? undefined : '8px'}}
            {...props}
        >
            {placeholder}
        </LoadingBlock>
    );
};

export default LoadingPlaceholder;
