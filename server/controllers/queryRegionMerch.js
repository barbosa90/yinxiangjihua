module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await getMerchDetail(params)
  ctx.body = chunk
}


var getMerchDetail = (params) => {
  return new Promise((resolve, reject) => {
    const config = require('../config')
    var conf = {}
    conf = config.mysql
    var mysql = require('mysql')
    var connection = mysql.createConnection(conf)
    connection.connect(function (err) {
      if (err != null) console.log(err)
    })
    var queryString = 'SELECT * FROM Merchandise WHERE location = ?'
    var subCondition = ''
    
    if (params != null){
      if (params.sl != null ){
        subCondition = ' AND subLocation = ?'
      }
      if (params.el != null ) {
        subCondition += ' AND endLocation = ?'
      }
    }

    var queryString2 = 'SELECT a.*,Graphs.graph_blob FROM (SELECT * FROM Merchandise LEFT JOIN Merch_content ON (Merchandise.id = Merch_content.merchid  )) a LEFT JOIN Graphs ON Graphs.id = a.graphid ORDER BY id LIMIT ?,?;'
    var queryString3 = 'SELECT a.*,Graphs.graph_blob FROM (SELECT * FROM Merchandise LEFT JOIN Merch_content ON (Merchandise.id = Merch_content.merchid  ) WHERE location = ? AND subLocation = ? AND endLocation = ?) a LEFT JOIN Graphs ON Graphs.id = a.graphid ORDER BY id LIMIT ?,?;'

    queryString += subCondition + 'ORDER BY id'
    //queryString = 'SELECT a.* FROM (' + queryString + ') a'
    var quantity = parseInt(params.quantity)
    var page = params.page
    var start = (params.page - 1) >= 0 ? (params.page - 1) : 0
    start = start * quantity
    var paramsUsed = [params.l, params.sl, params.el, start, quantity]
    connection.query(queryString3, paramsUsed, function (err, rows, fields) {

      if (err != null) reject(err)

      else resolve(rows)
    });
    connection.end()
  })
}