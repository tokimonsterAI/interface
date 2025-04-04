import {BigNumber} from 'ethers';
import React, {useCallback, useRef} from 'react';
import {Box, Flex, Input, ThemeUIStyleObject} from 'theme-ui';

type EditableRowProps = {
  value?: string
  onValueChange: (editedAmount: string) => void
  maxValue?: string
  decimals?: number
  placeholder?: string
  autoFocus?: boolean
  sx?: ThemeUIStyleObject
};

export const EditableRow: React.FC<EditableRowProps> = ({
    value,
    onValueChange,
    maxValue,
    decimals,
    placeholder,
    autoFocus = false,
    sx
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const [integerPart, decimalPart] = value.split('.');
        if (decimalPart && decimals && decimalPart.length > decimals) {
            onValueChange(`${integerPart}.${decimalPart.slice(0, decimals)}`);
        } else {
            onValueChange(value);
        }
    }, [decimals, onValueChange]);

    return (
        <Flex sx={{width: '100%', alignItems: 'center', ...sx}}>
            <Input
                variant='editInput'
                ref={inputRef}
                type="number"
                min={0}
                step="any"
                placeholder={maxValue || placeholder}
                value={value || ''}
                onChange={onChange}
                onWheel={() => inputRef.current?.blur()}
                autoFocus={autoFocus}
            />

            {maxValue && !BigNumber.fromDecimal(maxValue).isZero() && (
                <Box
                    sx={{color: 'black', cursor: 'pointer', paddingRight: '30px', fontSize: '18px'}}
                    onClick={() => onValueChange(maxValue)}
                >
                    Max
                </Box>
            )}
        </Flex>
    );
};
