import {CopyOutlined, CopyFilled} from '@ant-design/icons';
import React, {useState, useEffect, useCallback} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import {Box, ThemeUIStyleObject} from 'theme-ui';

import Cond from '@shared/fe/component/cond';

type CopyProp = {
    iconSize?: number
    onCopy?: (text: string) => void
    inline?: boolean
    sx?: ThemeUIStyleObject
    noPadding?: boolean
} & CopyToClipboard.Props;

const Copy: React.FCD<CopyProp> = ({
    children,
    text,
    inline = true,
    onCopy,
    sx,
    noPadding
}) => {
    const [copied, setCopied] = useState<string>();

    useEffect(() => {
        if (copied == undefined) {
            return;
        }

        const timerId = setTimeout(() => setCopied(undefined), 2e3);

        return () => {
            clearTimeout(timerId);
        };
    }, [copied]);

    const handleCopy = useCallback(() => {
        setCopied(text);
        onCopy?.(text);
    }, [onCopy, text]);

    return (
        <Box sx={{display: inline ? 'inline-block' : 'block', ...sx}}>
            <CopyToClipboard
                text={text}
                onCopy={handleCopy}
            >
                {children ||
                <Box
                    sx={{
                        p: noPadding ? 0 : 3,
                        color: copied ? 'linkHover' : 'inherit',
                        cursor: 'pointer',
                    }}
                >
                    <Cond
                        cond={copied}
                        fragment
                    >
                        <CopyFilled />

                        <CopyOutlined />
                    </Cond>
                </Box>
                }
            </CopyToClipboard>
        </Box>
    );
};

export default Copy;
