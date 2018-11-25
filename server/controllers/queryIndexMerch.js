module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  params = []
    
  var chunk = await query('SELECT a.*,GRAPHS.GRAPH_BLOB FROM (SELECT * FROM MERCHANDISE JOIN MERCH_CONTENT ON (MERCHANDISE.ID = MERCH_CONTENT.MERCHID  AND MERCH_CONTENT.MAINPAGE is not null)) a ,GRAPHS WHERE GRAPHS.ID = a.MAINPAGE;',params)
  ctx.body = chunk
}

