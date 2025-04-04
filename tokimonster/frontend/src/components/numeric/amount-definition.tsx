import {Flex, Text, ThemeUIStyleObject} from 'theme-ui';

export const AmountDefinition: React.FCC<{
    label: string | React.ReactNode
    value?: string | React.ReactNode
    titleSx?: ThemeUIStyleObject
    valueSx?: ThemeUIStyleObject
}> = ({label, value, titleSx, valueSx, className}) => {
    return (
        <Flex
            className={className}
            sx={{justifyContent: 'space-between'}}
        >
            <Text sx={{mr: 3, ...titleSx}}>{label}</Text>
            <Text sx={{...valueSx}}>{value ? value : '--'}</Text>
        </Flex>
    );
};
