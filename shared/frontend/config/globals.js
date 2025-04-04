export default {
    // dev test prod
    __STAGE__: JSON.stringify(process.env.STAGE ?? 'dev')
};
