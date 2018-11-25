module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  let userid = params.userid
  params = [userid]
    
  var chunk = await query('SELECT * FROM DELIVERADDRESS WHERE USERID = ?',params)
  ctx.body = chunk
}