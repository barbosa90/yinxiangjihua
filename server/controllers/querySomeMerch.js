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
    var queryString = 'SELECT a.*,Graphs.graph_blob FROM (SELECT distinct Merchandise.*, Merch_content.merchid,Merch_content.graphid FROM Merchandise ,Merch_content WHERE Merch_content.list != null AND Merchandise.id = Merch_content.merchid) a LEFT JOIN Graphs ON Graphs.id = a.list ORDER BY showTime LIMIT ?,?;'
    var quantity = parseInt(params.quantity)
    var page = params.page
    var start = (params.page - 1) >= 0 ? (params.page - 1) : 0
    start = start * quantity
    params = [ start , quantity ]
    connection.query(queryString, params, function (err, rows, fields) {

      if (err != null) reject(err)

      else resolve(rows)
    });
    connection.end()
  })
}
