import {Box, Flex, ThemeUIStyleObject} from 'theme-ui';

function Bar({className}: {className?: string}) {
    return (
        <Box
            className={className}
            sx={{
                width: '100%',
                bg: 'primary',
                transition: '.2s ease-in-out'
            }}
        />
    );
}

export default function MenuIcon({className, horizontal}: {className?: string; horizontal?: boolean}) {
    const bg = horizontal ? 'primary' : 'transparent';
    const iconWidth = 16;
    const crossWidth = Math.floor(iconWidth * Math.sqrt(2));
    const barHeight = 2;
    const crossSx = (rotateDirection = '') => ({
        ml: `${(iconWidth - crossWidth) / 2}px`,
        width: crossWidth,
        height: barHeight,
        transform: horizontal ? 'none' : `translateY(${rotateDirection}${(iconWidth - barHeight) / 2}px)rotate(${rotateDirection}45deg)`,
        transformOrigin: 'center',
        borderRadius: barHeight
    }) as ThemeUIStyleObject;

    return (
        <Flex
            className={className}
            sx={{
                position: 'relative',
                width: iconWidth,
                height: iconWidth,
                overflow: 'hidden',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <Bar sx={crossSx()} />
            <Bar sx={{bg, height: barHeight}} />
            <Bar sx={crossSx('-')} />
        </Flex>
    );
}
