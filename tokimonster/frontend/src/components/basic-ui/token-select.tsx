import {Select as ASelect, SelectProps} from 'antd';
import {useMemo, useCallback} from 'react';

import {ThemeUIStyleObject} from '@shared/fe/types/jsx';

import {TokenInfo} from 'src/contracts/tokens';

type Props = {
    token?: TokenInfo
    list?: TokenInfo[]
    onTokenChange?: (token?: TokenInfo) => void
    asInputHeader?: boolean
    sx?: ThemeUIStyleObject
}

const TokenSelect: React.FC<Props & SelectProps> = ({token, list, onTokenChange, asInputHeader, sx, ...props}) => {
    const value = useMemo(() => {
        if (!token) {
            return;
        }

        const index = list?.findIndex(item => item.address === token.address);
        if (index === undefined || index < 0) {
            return;
        }

        return index;
    }, [token, list]);

    const onChange = useCallback((index: number) => onTokenChange?.(list?.[index]), [list, onTokenChange]);

    return (
        <ASelect
            value={value}
            onChange={onChange}
            bordered={false}
            sx={{
                display: 'flex',
                alignItems: 'center',
                height: '50px',
                backgroundColor: 'white',
                borderRadius: '10px',
                ...(asInputHeader ? {flexShrink: 0, width: ['100%', '50%']} : {}),
                ...sx
            }}
            {...props}
        >
            {
                list?.map((item, idx) => {
                    return (
                        <ASelect.Option
                            key={item.address}
                            value={idx}
                        >
                            <img
                                src={item?.iconUrl}
                                style={{width: '20px', marginRight: '8px'}}
                            />

                            {item?.symbol}
                        </ASelect.Option>
                    );
                })
            }
        </ASelect>
    );
};

export default TokenSelect;
