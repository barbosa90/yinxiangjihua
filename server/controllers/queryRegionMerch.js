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
	var locationstring = ' AND Merchandise.location = ?'

  if (params != null) {
    if (params.sl != null) {
      locationstring += ' AND Merchandise.subLocation = ?'
    }
    if (params.el != null) {
      locationstring += ' AND Merchandise.endLocation = ?'
    }
  }
  var queryString = 'SELECT a.*,Graphs.graph_blob FROM (SELECT distinct Merchandise.*, Merch_content.merchid,Merch_content.list FROM Merchandise ,Merch_content WHERE Merch_content.list is not null AND Merchandise.id = Merch_content.merchid ' + locationstring + ') a LEFT JOIN Graphs ON Graphs.id = a.list ORDER BY a.showTime LIMIT ?,?;'
    
  var chunk = await query(queryString,paramsUsed)
  ctx.body = chunk
}