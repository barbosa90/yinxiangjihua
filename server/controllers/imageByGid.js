module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  var id = params.gid
  params = [id]
  var chunk = await query('SELECT graph_blob FROM Graphs WHERE id = ?;',params)
  ctx.body = chunk
}
