module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  let amount = params.amount
  let id = params.id
  params = [id, amount]
  var chunk = await query("CALL refill_merch_amount(?,?);",params)
  ctx.body = chunk
}
