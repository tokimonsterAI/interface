import {FlexProps} from 'theme-ui';

import {FormBox as SharedFormBox, FormBoxProps} from '@shared/fe/component/box/form-box';

import {InputRow} from './input';

export const FormRow: React.FCD<FlexProps> = props => (
    <InputRow {...props} />
);

const FormBox: React.FC<React.PropsWithChildren<FormBoxProps>> = ({mainSx, ...props}) => (
    <SharedFormBox
        mainSx={{
            marginBottom: 0,
            px: 0,
            fontWeight: 'normal',
            fontSize: '18px',
            ...mainSx,
        }}
        {...props}
    />
);

export default FormBox;
