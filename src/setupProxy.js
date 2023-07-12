const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/chitaleApi', {
      target: "http://web.chitalebandhu.in:8080", // API endpoint 1
      changeOrigin: true,
      pathRewrite: {
        "^/chitaleApi": "",
      },
      headers: {
        Connection: "keep-alive"
      }
    })
  );

  app.use(
    createProxyMiddleware('/sapApi', {
      target: 'http://cbms4prdapp.chitalebandhu.net.in:8000', // API endpoint 2
      changeOrigin: true,
      pathRewrite: {
        "^/sapApi": "",
      },
      headers: {
        Connection: "keep-alive"
      }
    })
  );
  app.use(
    createProxyMiddleware('/E_invoiceQRCode', {
      target: 'https://pro.mastersindia.co', // API endpoint 2
      changeOrigin: true,
      pathRewrite: {
        "^/E_invoiceQRCode": "",
      },
      headers: {
        Connection: "keep-alive"
      }
    })
  );

}