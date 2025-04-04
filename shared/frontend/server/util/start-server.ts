import http from 'http';

import timeTag from './time-tag';

timeTag(8); // log timezone use Beijing

export default function startServer(listener: http.RequestListener, defaultPort: number) {
    const {PORT, STAGE, NODE_ENV} = process.env;
    console.log('process.env', {PORT, NODE_ENV, STAGE});
    const port = PORT ?? defaultPort;
    console.log('Use "PORT=xx" to override default listen port.');
    const httpServer = http.createServer(listener).listen(port, () => {
        console.log('Server is listening on', port);
    });
    httpServer.timeout = 0;

    return httpServer;
}
