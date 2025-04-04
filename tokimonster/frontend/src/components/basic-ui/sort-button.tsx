import {Dropdown, Menu} from 'antd';
import {useMemo} from 'react';
import {Text, Button} from 'theme-ui';

export type SortButtonProps<SortKey = any> = {
    currentSortKey?: SortKey
    sortKey: SortKey
    isAscending: boolean
    hideUnSortedIcon?: boolean
    onClick?: (key: SortKey) => void
}

const SortButtonWithoutType: React.FCD<SortButtonProps> = ({
    currentSortKey,
    sortKey,
    isAscending,
    hideUnSortedIcon,
    onClick,
    children,
    ...props
}) => {
    return (
        <Text
            variant="clickable"
            onClick={() => onClick?.(sortKey)}
            {...props}
        >
            {children}

            <Text sx={{marginLeft: 1}}>
                {currentSortKey === sortKey && (isAscending ? '▲' : '▼')}
                {currentSortKey !== sortKey && !hideUnSortedIcon && '△▽'}
            </Text>
        </Text>
    );
};

type SortField<SortKey = any> = {
    key: SortKey
    label: string
    mobileLabel?: string
}

export type SortButtonGroupProps<SortKey = any> = {
    fields: SortField<SortKey>[]
    currentSortKey?: SortKey
    isAscending?: boolean
    onSort?: (key: SortKey) => void
}

export const SortButtonGroupWithoutType: React.FC<SortButtonGroupProps> = ({
    fields,
    currentSortKey,
    isAscending,
    onSort
}) => {
    return (
        <>
            {fields?.map(({key, label}) => (
                <SortButtonWithoutType
                    key={key}
                    currentSortKey={currentSortKey}
                    sortKey={key}
                    isAscending={!!isAscending}
                    onClick={onSort}
                >
                    {label}
                </SortButtonWithoutType>
            ))}
        </>
    );
};

export type SortButtonDropdownProps<SortKey = any> = SortButtonGroupProps<SortKey> & { showLabel?: boolean};

export const SortButtonDropdownWithoutType: React.FC<SortButtonDropdownProps> = ({
    fields,
    currentSortKey,
    isAscending,
    onSort,
    showLabel,
    ...props
}) => {
    const currentField = useMemo(() => fields.find(({key}) => key === currentSortKey), [currentSortKey, fields]);
    const isSorted = useMemo(() => !!currentField, [currentField]);

    return (
        <Dropdown overlay={
            <Menu sx={{variant: 'layout.headerMenu'}} >
                {fields.map(({key, label, mobileLabel}) => (
                    <Menu.Item
                        key={key}
                        sx={theme => theme.layout?.headerMenuItem as any}
                        onClick={() => onSort?.(key)}
                    >
                        <SortButtonWithoutType
                            key={key}
                            currentSortKey={currentSortKey}
                            sortKey={key}
                            isAscending={!!isAscending}
                            hideUnSortedIcon
                        >
                            {mobileLabel ?? label}
                        </SortButtonWithoutType>
                    </Menu.Item>
                ))}
            </Menu>
        }
        >
            <Button
                variant="icon-transparent"
                sx={showLabel ? {width: '100%'} : {}}
                {...props}
            >
                {showLabel && <>{currentField ? `${currentField?.label} ` : ''}</>}
                {!isSorted ? '△▽' : (<Text>{isAscending ? '▲' : '▼'}</Text>)}
            </Button>
        </Dropdown>
    );
};

export default SortButtonWithoutType;
