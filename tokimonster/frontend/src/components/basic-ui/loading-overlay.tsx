import React from 'react';
import {Container, Spinner} from 'theme-ui';

export const LoadingOverlay: React.FC = () => (
    <Container
        variant="disabledOverlay"
        sx={{p: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'transparent'}}
    >
        <Spinner
            size="28px"
            sx={{color: 'textPrimary'}}
        />Loading...
    </Container>
);
