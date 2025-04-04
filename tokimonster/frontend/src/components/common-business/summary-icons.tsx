import {Flex, Image} from 'theme-ui';

import SummaryData, {SummaryDataPropsWithoutTitle} from './summary-data';

const SummaryIcons: React.FC<{icons?: string[]; size?: number} & SummaryDataPropsWithoutTitle> = ({
    icons,
    size = 32,

    ...props
}) => {
    return !icons?.length ? null : (
        <SummaryData
            title={(
                <Flex sx={{alignItems: 'center', gap: 2}}>
                    {icons.map(icon => (
                        <Image
                            key={icon}
                            src={icon}
                            width={size}
                            height={size}
                        />
                    ))}
                </Flex>
            )}
            {...props}
        />
    );
};

export default SummaryIcons;
