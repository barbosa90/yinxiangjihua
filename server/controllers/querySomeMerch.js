module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  var quantity = parseInt(params.quantity)
  var page = params.page
  var start = (params.page - 1) >= 0 ? (params.page - 1) : 0
  start = start * quantity
  params = [ start , quantity ]
    
  var chunk = await query('SELECT a.*,GRAPHS.GRAPH_BLOB FROM (SELECT distinct MERCHANDISE.*, MERCH_CONTENT.MERCHID,MERCH_CONTENT.LIST FROM MERCHANDISE ,MERCH_CONTENT WHERE MERCH_CONTENT.LIST is not null AND MERCHANDISE.ID = MERCH_CONTENT.MERCHID) a LEFT JOIN GRAPHS ON GRAPHS.ID = a.list ORDER BY SHOWTIME LIMIT ?,?;',params)
  ctx.body = chunk
}