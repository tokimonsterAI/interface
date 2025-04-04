import {createRoot} from 'react-dom/client';
import './polyfill';
import './style.less';

import Dapp from './Dapp';

const domNode = document.getElementById('root');
const root = createRoot(domNode as HTMLElement);
root.render(<Dapp />);
