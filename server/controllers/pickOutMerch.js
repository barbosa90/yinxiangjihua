module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await pickOutOneMerch(params)
  ctx.body = chunk
}


var pickOutOneMerch = (params) => {
  let id = params.merchid
  let amount = params.amount
  console.log(params)
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.mysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    
    var updateString = 'CALL pick_merch_amount(?,?)';
    var params = [id, amount];
    connection.query(updateString, params, function (err, rows, fields) {

      if (err != null) resolve(err)

      resolve(rows)
    });
    
    connection.end()
  })
}