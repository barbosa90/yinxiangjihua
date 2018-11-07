module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var _uuid = require('node-uuid')
  var uuid = _uuid.v1()
  var params = querystring.parse(ctx.request.querystring)
  let userid = params.userid
  let merchid = params.merchid
  let discount = params.discount
  let points = params.points
  let pointsUsed = params.pointsUsed
  let merchCost = params.merchCost
  let finalCost = params.finalCost
  let address = params.address
  let phone = params.phone
  let amount = params.amount
  let merchAmountLeft = params.merchAmountLeft
  var insertPreOrder = "INSERT INTO `Pre_order` (`id`, `userid`, `merchid`, `builtTime`, `destroyTime`, `payStatus`, `discount`, `points`, `pointsUsed`, `merchCost`, `finalCost`, `address`, `phone`,`amount`) VALUES (?, ?, ?, CURRENT_TIMESTAMP, date_add(NOW(), interval 10 MINUTE), '0', ?, ?, ?, ?, ?, ?, ?, ?);"
  var queryPreOrder = "SELECT destroyTime FROM Pre_order WHERE id = ?;"
  params = [uuid, userid, merchid, discount, points, pointsUsed, merchCost, finalCost, address, phone, amount, uuid]
  console.log({ pre_order_id: uuid })
  var chunk = await query(insertPreOrder + queryPreOrder,params,{pre_order_id:uuid})
  ctx.body = chunk
}