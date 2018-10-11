module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var _uuid = require('node-uuid')
  var uuid = _uuid.v1()
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await querySql(params, uuid)
  ctx.body = chunk

}


var querySql = (params, uuid) => {
  let userid = params.userid
  let merchid = params.merchid
  let discount = params.discount
  let points = params.points
  let pointsUsed = params.pointsUsed
  let merchCost = params.merchCost
  let finalCost = params.finalCost
  let address = params.address
  let phone = params.phone
  let merchAmountLeft = params.merchAmountLeft
  console.log(uuid)
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.multiMysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) {
        console.log(err)
      }
    })
    var insertPreOrder = "INSERT INTO `Pre_order` (`id`, `userid`, `merchid`, `builtTime`, `destroyTime`, `payStatus`, `discount`, `points`, `pointsUsed`, `merchCost`, `finalCost`, `address`, `phone`) VALUES (?, ?, ?, CURRENT_TIMESTAMP, date_add(NOW(), interval 10 MINUTE), '0', ?, ?, ?, ?, ?, ?, ?);"
    var queryPreOrder = "SELECT destroyTime FROM Pre_order WHERE id = ?;"
    var params = [uuid, userid, merchid, discount, points, pointsUsed,merchCost,finalCost, address, phone, uuid]
    connection.query(insertPreOrder + queryPreOrder, params, function (err, result) {

      if (err != null) {
        reject(err)
        return
      }
      var pre_order_id = 0
      pre_order_id = uuid
      resultData = {
        code: 200,
        msg: 'sqlsucceed',
        data: result,
        pre_order_id: pre_order_id
      }
      resolve(resultData)
    })
    connection.end()
  })
}
