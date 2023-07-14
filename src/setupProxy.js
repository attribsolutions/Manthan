const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/chitaleApi',
    createProxyMiddleware({
      target: 'http://web.chitalebandhu.in:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/chitaleApi': '',
      },
    })
  );

  app.use(
    '/sapApi',
    createProxyMiddleware({
      target: 'http://cbms4prdapp.chitalebandhu.net.in:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/sapApi': '',
      },
    })
  );

  app.use(
    '/E_invoiceQRCode',
    createProxyMiddleware({
      target: 'https://pro.mastersindia.co',
      changeOrigin: true,
      pathRewrite: {
        '^/E_invoiceQRCode': '',
      },
    })
  );
};
