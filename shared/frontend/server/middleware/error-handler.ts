import {Application, ErrorRequestHandler} from 'express';

const handler: ErrorRequestHandler = (err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    console.error(`${req.path} request error`, err);
    res.status(500).send('Internal Server Error');
};

export function mountErrorHandler(app: Application) {
    app.get('/api/restricted/test-sync-error', () => {
        throw new Error('sync error');
    });

    app.get('/api/restricted/test-async-error', async () => {
        throw new Error('async error');
    });

    app.use(handler);
}
