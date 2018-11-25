module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  var quantity = parseInt(params.quantity)
  var page = params.page
  var start = (page - 1) >= 0 ? (page - 1) : 0
  start = start * quantity
  var paramsUsed = [params.l, params.sl, params.el, start, quantity]
	var locationstring = ' AND MERCHANDISE.LOCATION = ?'

  if (params != null) {
    if (params.sl != null) {
      locationstring += ' AND MERCHANDISE.SUBLOCATION = ?'
    }
    if (params.el != null) {
      locationstring += ' AND MERCHANDISE.ENDLOCATION = ?'
    }
  }
  var queryString = 'SELECT a.*,GRAPHS.GRAPH_BLOB FROM (SELECT distinct MERCHANDISE.*, MERCH_CONTENT.MERCHID,MERCH_CONTENT.list FROM MERCHANDISE ,MERCH_CONTENT WHERE MERCH_CONTENT.LIST is not null AND MERCHANDISE.ID = MERCH_CONTENT.MERCHID ' + locationstring + ') a LEFT JOIN GRAPHS ON GRAPHS.ID = a.list ORDER BY a.SHOWTIME LIMIT ?,?;'
    
  var chunk = await query(queryString,paramsUsed)
  ctx.body = chunk
}