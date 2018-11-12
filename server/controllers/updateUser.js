module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  let reg_name = params.reg_name
  let reg_phone = params.reg_phone
  let city = params.city
  let province = params.province
  let id = params.id
  let gender = params.gender
  let age = params.age
  params = [reg_name, reg_phone, city, province, gender, age, id]
    
  var chunk = await query('UPDATE `User` SET `reg_name` = ?, `reg_phone` = ?, `city` = ?, `province` = ? `gender` = ? `age` = ? WHERE `User`.`id` = ?;',params)
  ctx.body = chunk
}