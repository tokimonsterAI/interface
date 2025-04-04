import {Box, Heading, BoxProps} from 'theme-ui';

type Props = {
    title?: React.ReactNode
    children?: React.ReactNode
}

const Section: React.FCC<Props & BoxProps> = ({title, children, ...props}) => (
    <Box
        pb={11}
        {...props}
    >
        <Heading
            variant='sectionTitle'
        >
            {title}
        </Heading>

        {children}
    </Box>
);

export default Section;
