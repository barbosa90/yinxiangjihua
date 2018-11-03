module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await query(params)
  ctx.body = chunk
}


var query = (params) => {
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.multiMysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    var selectString1 = "SELECT * FROM `Pre_order` WHERE `Pre_order`.`id` = ? FOR UPDATE;" ;
    var selectString2 = "UPDATE `Pre_order` SET `payStatus` = '1' WHERE `Pre_order`.`id` = ?;";
    var selectString3 = "INSERT INTO `Paid_order` (`USERID`, `ORDERID`, `MERCHID`, `PAIDTIME`, `STATUS`, `DISCOUNT`, `POINTSUSED`, `POINTS`, `MERCHCOST`, `FINALCOST`, `AMOUNT`, `ADDRESS`, `PHONE`, `DEADLINE`) VALUES (?, ?, ?, CURRENT_TIMESTAMP, b'0', ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    //查询订单，更改订单状态，插入支付订单：用户id，订单id，商品id，支付时间，状态，折扣，使用积分，获得积分，商品价，最终价，数量，地址，电话，最晚使用时间可为空
    var paramsArr = [params.orderid, params.orderid, params.userid, params.orderid, params.merchid, params.discount, params.pointsused, params.points, params.merchcost, params.finalcost, params.amount, params.address, params.phone, params.deadline]
    connection.query(selectString, paramsArr, function (err, rows, fields) {

      if (err != null) reject(err)

      else {
        resultData = {
          code: 200,
          msg: 'sql成功',
          data: result[0]
        }
        resolve(resultData)
      }
    });
    connection.end()
  })
}