import {NavLink} from 'react-router-dom';
import {Box, Flex, Text, Image, Link, ThemeUIStyleObject} from 'theme-ui';

import {SvgInfoPopover} from 'src/components/basic-ui/popover';
import {zIndex} from 'src/constants';

import {SvgIcon} from '../basic-ui/icon';

type LayoutType = 'default' | 'reverse';
type TitleSize = 'default' | 'large';

type SummaryDataProps = {
    className?: string
    title: React.ReactNode
    titleTip?: React.ReactNode
    titleLink?: string
    extraTitle?: React.ReactNode
    label?: React.ReactNode
    labelExtra?: React.ReactNode
    tip?: React.ReactNode
    iconUrl?: string

    mainSx?: ThemeUIStyleObject
    titleSx?: ThemeUIStyleObject

    // variants
    layout?: LayoutType
    titleSize?: TitleSize
}

export type SummaryDataPropsWithoutTitle = Omit<SummaryDataProps, 'title'>;

const SummaryData: React.FC<SummaryDataProps> = ({
    layout = 'default',
    titleSize = 'default',

    className,
    title,
    titleTip,
    titleLink,
    extraTitle,
    label,
    labelExtra,
    tip,
    iconUrl,

    mainSx,
    titleSx,
}) => {
    const iconSize = titleSize === 'large' ? ['40px', '72px'] : '40px';

    return (
        <Flex
            sx={{justifyContent: 'flex-start', alignItems: 'center', gap: 3, ...mainSx}}
        >
            {iconUrl && (
                <Image
                    src={iconUrl}
                    sx={{
                        width: iconSize,
                        height: iconSize,
                        flexShrink: 0,
                    }}
                />
            )}

            <Flex
                className={className}
                sx={{flexDirection: layout === 'reverse' ? 'column-reverse' : 'column', gap: 2}}
            >
                {(label || tip) && (
                    <Flex sx={{alignItems: 'center', justifyContent: 'start', gap: 1}}>
                        <Text sx={{
                            lineHeight: 1,
                            fontSize: ['12px', '14px'],
                            color: 'text'
                        }}
                        >
                            {label}
                        </Text>

                        {tip && (
                            <SvgInfoPopover
                                content={tip}
                                zIndex={zIndex.popover}
                                trigger="['hover', 'click']"
                                overlayInnerStyle={{whiteSpace: 'pre-line'}}
                            />
                        )}

                        {labelExtra}
                    </Flex>
                )}

                <Flex sx={{alignItems: 'center', justifyContent: 'start', gap: 1}}>
                    <Box sx={{
                        variant: 'layout.summaryDataTitle',
                        fontSize: titleSize === 'large' ? ['20px', '36px'] : '16px',
                        fontWeight: 500,
                        ...titleSx
                    }}
                    >
                        {title}
                    </Box>

                    {titleTip && (
                        <SvgInfoPopover
                            content={titleTip}
                            zIndex={zIndex.popover}
                            trigger="['hover', 'click']"
                            overlayInnerStyle={{whiteSpace: 'pre-line'}}
                        />
                    )}

                    {titleLink && (
                        titleLink.startsWith('/') ? (
                            <NavLink
                                to={titleLink}
                                sx={{lineHeight: 1, display: 'block'}}
                            >
                                <SvgIcon
                                    type="link"
                                />
                            </NavLink>
                        ) : (
                            <Link
                                sx={{lineHeight: 1, display: 'block'}}
                                href={titleLink}
                                target="_blank"
                            >
                                <SvgIcon type="link" />
                            </Link>
                        )
                    )}
                </Flex>

                {extraTitle && <Box sx={{fontSize: '12px', lineHeight: 1}}>{extraTitle}</Box>}
            </Flex>
        </Flex>
    );
};

export default SummaryData;
