import {checkBlockedIp, getIpMap} from '../util/access-control';

import type {Application} from 'express';

const FORBIDDEN_MSG = 'Accessing too frequently. Please take a break and come back later.';

export default function mountAccessControl(app: Application, {serviceName}: {serviceName: string}) {
    const tag = `[${serviceName}]`;

    app.set('trust proxy', true);

    app.use((req, res, next) => {
        const isLocal = req.ip?.endsWith('127.0.0.1'); // exclude local IP which comes from Node side requests
        if (!isLocal && checkBlockedIp(tag, req.ip)) {
            res.status(403).send(FORBIDDEN_MSG);

            return;
        }

        next();
    });

    app.get('/api/restricted/access-control', (req, res) => {
        res.json({
            data: Object.values(getIpMap()).sort((a, b) => a.lastAccessTime - b.lastAccessTime) // sort by lastAccessTime DESC
        });
    });
}
