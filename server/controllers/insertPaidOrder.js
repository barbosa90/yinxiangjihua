module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  params = [params.orderid, params.userid, params.merchid, params.discount, params.pointsused, params.points, params.merchcost, params.finalcost, params.amount, params.address, params.phone]
    
  var chunk = await query("CALL insert_paid_order(?,?,?,?,?,?,?,?,?,?,?)",params)
  ctx.body = chunk
}