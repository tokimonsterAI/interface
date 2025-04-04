import {useCallback, useMemo} from 'react';
import {Flex, Grid, Box, Button, Label, Text, Input as ThemeUIInput, InputProps, BoxProps, FlexProps, ThemeUIStyleObject} from 'theme-ui';

import {BNumberComponent} from 'src/components/numeric/big-number';
import {formCellPaddingX} from 'src/theme';

type CustomProps = {
    decimals?: number
    price?: number
    priceSymbol?: string

    head?: React.ReactNode
    tail?: React.ReactNode
    tailText?: string

    containerSx?: ThemeUIStyleObject

    onTextChange?: (text: string | undefined) => void
    onMaxButtonClick?: () => void
}

const Input: React.FC<InputProps & CustomProps> = ({
    decimals,
    price,
    priceSymbol = '$',

    head,
    tail,
    tailText,

    containerSx,
    sx,

    onChange,
    onTextChange,
    onMaxButtonClick,

    ...props
}) => {
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const [integerPart, decimalPart] = value.split('.');
        if (decimalPart && decimals !== undefined && decimalPart.length > decimals) {
            onTextChange?.(`${integerPart}.${decimalPart.slice(0, decimals)}`);
        } else {
            onTextChange?.(value);
        }

        onChange?.(event);
    }, [decimals, onChange, onTextChange]);

    const fiatValue = useMemo(() => {
        if (!price) {
            return undefined;
        }

        const value = Number(props.value);
        if (isNaN(value)) {
            return undefined;
        }

        return value * price;
    }, [price, props.value]);

    const showFiatValue = price && fiatValue;

    return (
        <Flex sx={{
            overflow: 'hidden',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: ['column', 'row'],
            borderRadius: '10px',
            backgroundColor: 'backgroundPrimary',
            ...containerSx
        }}
        >
            {head}

            <Flex sx={{justifyContent: 'space-between', alignItems: 'center', flex: 1, width: '100%'}}>
                <Box sx={{flex: 1, height: 50}}>
                    <ThemeUIInput
                        onChange={handleChange}
                        sx={{
                            height: showFiatValue ? 32 : 50,
                            border: 'none',
                            backgroundColor: 'backgroundPrimary',
                            ...(head ? {paddingX: [formCellPaddingX, '4px']} : {}),
                            ...(tailText ? {paddingRight: ['4px', '4px']} : {}),
                            ...sx
                        }}
                        {...props}
                    />

                    {showFiatValue && (
                        <Text sx={{
                            display: 'block',
                            color: '#aaa',
                            lineHeight: 1,
                            fontSize: '12px',
                            ...(head ? {paddingX: [formCellPaddingX, '4px']} : {paddingX: formCellPaddingX}), // same as above
                        }}
                        >
                            <BNumberComponent
                                value={fiatValue}
                                prefix={priceSymbol}
                            />
                        </Text>
                    )}
                </Box>

                {tail}

                {!tail && tailText && (
                    <Text sx={{
                        marginRight: formCellPaddingX, // same as formCell paddingX
                        height: '50px',
                        lineHeight: '50px',
                        color: 'black',
                        fontSize: '18px'
                    }}
                    >
                        {tailText}
                    </Text>
                )}

                {!tail && onMaxButtonClick && (
                    <Button
                        variant="transparent"
                        onClick={onMaxButtonClick}
                        sx={{height: '100%'}}
                    >
                        Max
                    </Button>
                )}
            </Flex>
        </Flex>
    );
};

type InputBoxProps = {
    title?: React.ReactNode
    allowance?: React.ReactNode
    allowanceTitle?: React.ReactNode
    available?: React.ReactNode
    availableTitle?: React.ReactNode
    tail?: React.ReactNode
    size?: 'tiny' | 'small' | 'normal' |'large'
}

const widths = {
    tiny: 160,
    small: 350,
    normal: 500,
    large: 700
};

export const InputBox: React.FCD<InputBoxProps & BoxProps> = ({
    title,
    allowance,
    allowanceTitle = 'Allowance',
    available,
    availableTitle = 'Balance',
    tail,
    size = 'normal',
    children,
    sx,
    ...props
}) => {
    return (
        <Box
            sx={{width: ['100%', widths[size]], ...sx}}
            {...props}
        >
            <Grid
                sx={{
                    gridTemplateColumns: [
                        '1fr max-content',
                        allowance !== undefined && available !== undefined ? '1fr 1fr max-content' : '1fr max-content'
                    ],
                    marginBottom: 2
                }}
            >
                <Label sx={{
                    fontWeight: '500',
                    gridColumn: ['1/-1', 'span 1']
                }}
                >
                    {title}
                </Label>

                {allowance && (
                    <Label>
                        <Flex sx={{alignItems: 'center'}}>
                            {allowanceTitle}:&nbsp;

                            {allowance}
                        </Flex>
                    </Label>
                )}

                {available && (
                    <Label>
                        <Flex sx={{alignItems: 'center'}}>
                            {availableTitle}:&nbsp;

                            {available}
                        </Flex>
                    </Label>
                )}

                {tail}
            </Grid>

            {children}
        </Box>
    );
};

type InputBoxGroupProps = {
    asInputBox?: boolean
    size?: InputBoxProps['size']
}

export const InputBoxGroup: React.FCD<FlexProps & InputBoxGroupProps> = ({children, asInputBox, size = 'normal', ...props}) => {
    return (
        <Flex
            sx={{
                gap: 5,
                flexDirection: ['column', 'row'],
                width: asInputBox ? ['100%', widths[size]] : undefined
            }}
            {...props}
        >
            {children}
        </Flex>
    );
};

export const inputRowMarginTop = '24px';

export const InputRow: React.FCD<FlexProps> = ({children, ...props}) => {
    return (
        <Flex
            sx={{
                mt: inputRowMarginTop,
                gap: 5,
                flexDirection: ['column', 'column', 'row'],
            }}
            {...props}
        >
            {children}
        </Flex>
    );
};

export default Input;
