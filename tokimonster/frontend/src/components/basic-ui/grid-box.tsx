import {useMemo} from 'react';
import {Grid, Box} from 'theme-ui';

type Props = {
    columns?: number | number[]
    divider?: boolean
    border?: boolean
}

const GridBox: React.FCD<Props> = ({children, columns = 2, divider = true, border, ...props}) => {
    const gridTemplateColumns = useMemo(() => {
        const arr = Array.isArray(columns) ? columns : [1, 1, columns];

        return arr.map(num => num > 1 ? `repeat(${num}, 1fr)` : '1fr');
    }, [columns]);

    const elements = ([] as any).concat(children) as React.ReactNode[];

    return (
        <Grid
            sx={{
                paddingY: ['24px', '36px'],
                gridTemplateColumns,
                alignItems: 'center',
                gap: '20px',
                ...(!border ? {} : {
                    border: '1px solid',
                    borderColor: 'border',
                    backgroundColor: 'backgroundSecondary'
                })
            }}
            {...props}
        >
            {elements.map((el, index) => (
                <Box
                    key={index}
                    sx={divider === false ? {} : {
                        'position': 'relative',
                        ':not(:last-child)::after': {
                            content: '""',
                            position: 'absolute',
                            right: '-10px', // 1/2 gap
                            top: '10%',
                            height: '80%',
                            width: [0, 0, '1px'],
                            backgroundColor: 'border'
                        }
                    }}
                >
                    {el}
                </Box>
            ))}
        </Grid>
    );
};

export const BorderBox: React.FCD = ({children, ...props}) => {
    return (
        <Box
            sx={{
                'border': '1px solid',
                'borderColor': 'border',
                'backgroundColor': 'backgroundSecondary',
                ':not(:first-of-type)': {
                    borderTop: 'none',
                }
            }}
            {...props}
        >
            {children}
        </Box>
    );
};

export default GridBox;
