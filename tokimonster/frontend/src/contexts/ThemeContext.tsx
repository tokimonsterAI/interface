import React, {useEffect} from 'react';
import {useColorMode} from 'theme-ui';

export const CustomThemeProvider: React.FC<React.PropsWithChildren<object>> = ({children}) => {
    const [colorMode, setColorMode] = useColorMode();

    useEffect(() => {
        // 检查并设置初始模式
        const savedMode = localStorage.getItem('themeMode') || 'dark';
        if (!localStorage.getItem('themeMode')) {
            localStorage.setItem('themeMode', 'dark');
        }

        setColorMode(savedMode);
    }, [colorMode, setColorMode]);

    return <>{children}</>;
};

export const useTheme = () => {
    const [colorMode, setColorMode] = useColorMode();
    const isDarkMode = colorMode === 'dark';

    const toggleMode = () => {
        const newMode = isDarkMode ? 'light' : 'dark';
        setColorMode(newMode);
        localStorage.setItem('themeMode', newMode);
        // 更新 body 的背景色而不是 html
        document.body.style.backgroundColor = newMode === 'dark' ? '#202020' : '#f5f5f5';
    };

    return {
        mode: colorMode as 'light' | 'dark',
        toggleMode,
        isDarkMode
    };
};
