import {styled} from '@linaria/react';
import {Button, Text} from 'theme-ui';

const ButtonContent = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const ButtonIconWrapper = styled.div`
    width: 40px;
    margin-right: 18px;
    text-align: center;
`;

const ButtonIcon = styled.img`
    height: 40px;
    max-width: 40px;
`;

type SelectorItemProps<T> = {
    item: T
    getLabel: (item: T) => string
    getIconUrl: (item: T) => string
    onClick: () => void
}

const SelectorItem: React.FC<SelectorItemProps<any>> = ({item, getLabel, getIconUrl, onClick}) => (
    <Button
        variant="selector-item"
        onClick={onClick}
        sx={{marginBottom: 2}}
    >
        <ButtonContent sx={{fontSize: ['14px', '16px']}}>
            <ButtonIconWrapper>
                <ButtonIcon src={getIconUrl(item)}/>
            </ButtonIconWrapper>

            <Text sx={{color: 'black'}}>{getLabel(item)}</Text>
        </ButtonContent>
    </Button>
);

type SelectorProps<T> = {
    items: T[]
    getLabel: (item: T) => string
    getIconUrl: (item: T) => string
    onSelect: (item: T) => void
}

const ModalSelector: React.FC<SelectorProps<any>> = ({items, getLabel, getIconUrl, onSelect}) => {
    return (
        <div>
            {items.map(item => (
                <SelectorItem
                    key={getLabel(item)}
                    item={item}
                    getLabel={getLabel}
                    getIconUrl={getIconUrl}
                    onClick={() => onSelect(item)}
                />
            ))}
        </div>
    );
};

export default ModalSelector;
