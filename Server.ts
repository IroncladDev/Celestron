const createServer = (server) => {
  server.middlewares.use('/data-path', async (req, res, next) => {
    res.end(JSON.stringify(req.headers));
  });
  server.middlewares.use('/user-data', async (req, res, next) => {
    res.end(req.headers['x-replit-user-name'] ? req.headers['x-replit-user-name'] : false);
  });
};
export default createServer;