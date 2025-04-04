import {Popover} from 'antd';
import {Link, Box, LinkProps, ThemeUICSSObject} from 'theme-ui';

import {zIndex} from 'src/constants';

type PoolHeaderBottomLinkProps = LinkProps & {
    boxSx?: ThemeUICSSObject
    tip?: React.ReactNode
}

const PoolHeaderBottomLink = (props: PoolHeaderBottomLinkProps) => (
    <Box
        sx={{
            px: ['15px', '30px'],
            pb: ['15px', '30px'],
            ...props.boxSx
        }}
        onClick={e => e.stopPropagation()} // prevent trigger collapse
    >
        <Popover
            content={props.tip}
            zIndex={zIndex.popover}
            trigger="hover"
        >
            <Link
                sx={{
                    'display': ['block', 'inline-block'],
                    'width': ['100%', 'fit-content'],
                    'px': 4,
                    'py': 1,
                    'borderRadius': '5px',
                    'color': 'white',
                    'textDecoration': 'none',
                    'backgroundImage': 'linear-gradient(94.44deg,rgba(71,113,181,.8) 0%,rgba(126,216,201,.8) 25%,rgba(71,113,181,.8) 50%,rgba(41,70,112,.8) 75%,rgba(91,116,157,.8) 100%);',
                    ':hover': {
                        color: 'white',
                        textDecoration: 'none',
                    }
                }}
                target="_blank"
                {...props}
            />
        </Popover>
    </Box>
);

export default PoolHeaderBottomLink;
