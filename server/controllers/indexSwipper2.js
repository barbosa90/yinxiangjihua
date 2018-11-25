module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')

  var params = []
  var chunk = await query('SELECT GRAPHS.GRAPH_BLOB,MERCH_CONTENT.MERCHID FROM GRAPHS,MERCH_CONTENT WHERE MERCH_CONTENT.SWIPPER = GRAPHS.ID AND MERCH_CONTENT.SWIPPER is not null',params)
  ctx.body = chunk
}
