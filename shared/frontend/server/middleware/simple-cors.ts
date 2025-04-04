import type {Application} from 'express';

export interface SimpleCorsOptions {
    allowedOrigins?: string[]
    allowedPaths?: string[]
    whitelistedPaths?: string[] // allow all origins for these paths
}

export default function mountSimpleCORS(app: Application, options: SimpleCorsOptions = {}) {
    const {
        allowedOrigins = [],
        allowedPaths = [],
        whitelistedPaths = []
    } = options;

    app.use((req, res, next) => {
        const origin = req.headers.origin;
        const url = req.originalUrl;

        const isOriginAllowed = origin && allowedOrigins.includes(origin);
        const isPathAllowed = allowedPaths.some(allowedPath => url.startsWith(allowedPath));
        const isPathWhitelisted = whitelistedPaths.some(whitelistedPath => url.startsWith(whitelistedPath));

        if (isOriginAllowed && isPathAllowed) {
            res.setHeader('Access-Control-Allow-Origin', isPathWhitelisted ? '*' : origin);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers

            if (req.method === 'OPTIONS') {
                return res.sendStatus(200); // Respond to preflight requests
            }
        }

        next();
    });
}
