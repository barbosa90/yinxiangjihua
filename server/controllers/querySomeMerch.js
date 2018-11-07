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
    
  var chunk = await query('SELECT a.*,Graphs.graph_blob FROM (SELECT distinct Merchandise.*, Merch_content.merchid,Merch_content.list FROM Merchandise ,Merch_content WHERE Merch_content.list is not null AND Merchandise.id = Merch_content.merchid) a LEFT JOIN Graphs ON Graphs.id = a.list ORDER BY showTime LIMIT ?,?;',params)
  ctx.body = chunk
}