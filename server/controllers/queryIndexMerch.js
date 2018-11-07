module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  params = []
    
  var chunk = await query('SELECT a.*,Graphs.graph_blob FROM (SELECT * FROM Merchandise JOIN Merch_content ON (Merchandise.id = Merch_content.merchid  AND Merch_content.mainPage is not null)) a ,Graphs WHERE Graphs.id = a.mainPage;',params)
  ctx.body = chunk
}

