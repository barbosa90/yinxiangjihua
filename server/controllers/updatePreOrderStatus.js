module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var query = require('../api/mysqlPool.js')
  var params = querystring.parse(ctx.request.querystring)
  let orderids = params.orderids.split(',')
  let to = params.to
  params = [to]
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

  var queryString = 'UPDATE `PRE_ORDER` SET `PAYSTATUS` = ? WHERE `PAYSTATUS` != 1 AND `ID` in '+ inStr
  var chunk = await query(queryString,params)
  ctx.body = chunk
}