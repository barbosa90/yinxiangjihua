module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  let openid = params.openid
  params = [openid]
    
  var chunk = await query('SELECT * FROM USER WHERE OPENID = ?',params)
  ctx.body = chunk
}