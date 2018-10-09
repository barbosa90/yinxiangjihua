module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await updateUser(params)
  ctx.body = chunk


}


var updateUser = (params) => {
  let reg_name = params.reg_name
  let reg_phone = params.reg_phone
  let city = params.city
  let province = params.province
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
    var queryString = 'UPDATE `User` SET `reg_name` = ?, `reg_phone` = ?, `city` = ?, `province` = ? WHERE `User`.`id` = ?;'
    var params = [reg_name, reg_phone, city, province, id];
    connection.query(queryString, params, function (err, result) {

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
