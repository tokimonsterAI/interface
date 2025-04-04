import {useResponsiveValue} from '@theme-ui/match-media';
import {Popover as APopover, PopoverProps} from 'antd';
import {Box, Flex} from 'theme-ui';

import Icon, {SvgIcon} from 'src/components/basic-ui/icon';

type Props = PopoverProps & {
    sm?: PopoverProps
    lg?: PopoverProps
}

// use difference trigger & placement for PC/mobile
export const Popover: React.FC<Props> = ({sm, lg, ...props}) => {
    const smProps = {
        trigger: 'click',
        placement: 'bottom' as PopoverProps['placement'],
        ...sm
    };
    const lgProps = {
        trigger: 'hover',
        placement: 'right' as PopoverProps['placement'],
        ...lg
    };
    const popoverProps = useResponsiveValue([smProps, smProps, lgProps]);

    return (
        <APopover
            sx={{display: 'inline-block'}}
            {...props}
            {...popoverProps}
        />
    );
};

export const InfoPopover: React.FC<Props> = props => {
    return (
        <Popover {...props}>
            <Box
                style={{textAlign: 'center', width: 32}}
                onClick={e => e.stopPropagation()} // prevent collapse panel triggers in mobile
            >
                <Icon
                    type="info"
                    width={20}
                    style={{verticalAlign: 'sub', cursor: 'pointer'}}
                />
            </Box>
        </Popover>
    );
};

export const SvgInfoPopover: React.FC<Props> = props => {
    return (
        <Popover
            {...props}
            sx={{display: 'flex', cursor: 'pointer'}}
        >
            <Flex
                sx={{alignItems: 'center'}}
                onClick={e => e.stopPropagation()} // prevent collapse panel triggers in mobile
            >
                <SvgIcon type="info"/>
            </Flex>
        </Popover>
    );
};

export const SvgInfoPopoverBox: React.FCD<Props> = ({children, ...props}) => {
    return (
        <Flex sx={{alignItems: 'center', gap: 1}}>
            <Box>{children}</Box>
            {props.content && <SvgInfoPopover {...props} />}
        </Flex>
    );
};
