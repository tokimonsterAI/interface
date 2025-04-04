import express from 'express';

import mountAccessControl from '@shared/fe/server/middleware/access-control';
import {mountErrorHandler} from '@shared/fe/server/middleware/error-handler';
import {mountGoogleSheets} from '@shared/fe/server/middleware/google-sheets';
import mountHello from '@shared/fe/server/middleware/hello';
import mountStatic from '@shared/fe/server/middleware/static';
import {mountVendorProxy} from '@shared/fe/server/middleware/vendor-proxy';
import {startBot} from '@shared/fe/server/util/tele-bot';

import '@shared/fe/util/number-extension';

const serviceName = 'Tokimonster';

export default function startApp(isViteDev?: boolean) {
    const app = express();

    mountHello(app);

    mountAccessControl(app, {serviceName});
    mountVendorProxy(app);

    app.use(express.json({limit: '20mb'})); // must be put before google sheets middleware, keep the limit the same as in nginx.conf
    mountGoogleSheets(app, {
        serviceName,
        enableSuperApi: process.env.STAGE === 'test' // only enable super api in test stage
    });

    mountErrorHandler(app);
    if (!isViteDev) {
        mountStatic(app);
    }

    startBot();

    return app;
}
