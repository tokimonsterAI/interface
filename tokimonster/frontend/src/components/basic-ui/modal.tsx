import {Modal, ModalProps} from 'antd';
import {useEffect} from 'react';

import Icon from 'src/components/basic-ui/icon';

const CustomizedModal: React.FC<ModalProps> = props => {
    useEffect(() => {
        if (props.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    return (
        <Modal
            closeIcon={<Icon type="close" />}
            maskClosable={false}
            footer={null}
            centered
            {...props}
        />
    );
};

export default CustomizedModal;
