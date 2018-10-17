module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await updateStatus(params)
  ctx.body = chunk


}


var updateStatus = (params) => {
  let orderids = params.orderids.split(',')
  let to = params.to
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.mysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    if(orderids.length == 0){
      return
    }
    var inStr = '('
    for(var i = 0; i < orderids.length; i++){
      var orderid = orderids[i]
      if (inStr.length > 1){
        inStr += ','
      }
      inStr += '\"' + orderid + '\"'
    }
    inStr += ')'

    var queryString = 'UPDATE `Pre_order` SET `payStatus` = ? WHERE `payStatus` != 1 AND `id` in '+ inStr
    var params = [to]
    connection.query(queryString, params, function (err, result) {

      if (err != null) reject(err)
      else{}
      resultData = {
        code: 200,
        msg: 'sql成功',
        result: result
      }
      resolve(resultData)
    })
    connection.end()
  })
}
