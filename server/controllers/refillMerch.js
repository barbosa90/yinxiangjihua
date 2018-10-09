module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await update(params)
  ctx.body = chunk


}


var update = (params) => {
  let amount = params.amount
  let id = params.id
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.mysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    var updateMerchAmount = "CALL refill_merch_amount(?,?);"
    var params = [id, amount];
    connection.query(updateMerchAmount, params, function (err, result) {

      if (err != null) reject(err)
      resultData = {
        code: 200,
        msg: 'sql成功',
        data: result
      }
      resolve(resultData)
    })
    connection.end()
  })
}
