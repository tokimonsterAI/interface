import {Flex, Box, Text, Image} from 'theme-ui';

import Cond from '@shared/fe/component/cond';

import SummaryData, {SummaryDataPropsWithoutTitle} from './summary-data';

export type PoolHeaderMarketProps = {
    icon?: string
    icons?: string[]
    title?: React.ReactNode
    subtitle?: React.ReactNode
} & Pick<SummaryDataPropsWithoutTitle, 'titleTip'>
& Pick<SummaryDataPropsWithoutTitle, 'titleLink'>;

const PoolHeaderMarket: React.FC<PoolHeaderMarketProps> = ({icon, icons, title, subtitle, titleTip, titleLink, ...props}) => {
    return (
        <Flex
            variant="layout.poolHeaderMarket"
            {...props}
        >
            <Cond
                cond={icons}
                fragment
            >
                <Box sx={{whiteSpace: 'nowrap', minWidth: 80}}>
                    {
                        icons?.map((icon, index) => {
                            return (
                                <Image
                                    key={index}
                                    variant="poolHeaderIcon"
                                    sx={{mr: -3}}
                                    src={icon}
                                />
                            );
                        })
                    }
                </Box>

                <Image
                    variant="poolHeaderIcon"
                    src={icon}
                />
            </Cond>

            <Box>
                <SummaryData
                    sx={{minWidth: [120, 180], marginBottom: '4px'}}
                    title={title}
                    titleTip={titleTip}
                    titleLink={titleLink}
                />

                <Text variant="description">
                    {subtitle}
                </Text>
            </Box>
        </Flex>
    );
};

export default PoolHeaderMarket;
