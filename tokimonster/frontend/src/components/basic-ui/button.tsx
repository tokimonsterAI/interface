import Lottie from 'react-lottie';
import {Flex, Button as TButton, ButtonProps} from 'theme-ui';

import {useContinuousLoading} from '@shared/fe/hook/use-variable-loading';

import loadingAnimationData from 'src/assets/animation/button-loading.json';

const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

type BaseButtonProps = {
    loading?: boolean
}

const variantLoadingHeights: Record<string, number> = {
    'default': 20,
    'form-box-operation': 30
};

export const Button: React.FCD<ButtonProps & BaseButtonProps> = ({
    loading: isLoading,

    // button props
    variant,
    children,
    disabled,

    ...props
}) => {
    const {loading} = useContinuousLoading(isLoading);
    const loadingHeight = (variant && variantLoadingHeights[variant]) || variantLoadingHeights['default'];
    const loadingWidth = loadingHeight * 3;

    return (
        <TButton
            variant={variant}
            disabled={disabled || loading}
            {...props}
        >
            <Flex sx={{justifyContent: 'center', alignItems: 'center', gap: 1}}>
                {!loading && children}

                {loading && (
                    <Lottie
                        options={lottieOptions}
                        height={loadingHeight}
                        width={loadingWidth}
                        isClickToPauseDisabled
                    />
                )}
            </Flex>
        </TButton>
    );
};
