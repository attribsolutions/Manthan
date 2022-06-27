const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    'FoodERPWebAPIChart/api/StockReport/GetDateWiseStockReport?FromDate=2022-05-11&ToDate=2022-05-11&CompanyID=1&DivisionID=35',
    createProxyMiddleware({
      target: 'http://web.chitalebandhu.in:8080',
      changeOrigin: true,
    })
  );
};