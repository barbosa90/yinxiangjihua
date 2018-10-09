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
    var queryString = 'SELECT a.*,Graphs.graph_blob FROM (SELECT * FROM Merchandise JOIN Merch_content ON (Merchandise.id = Merch_content.merchid  AND Merch_content.used_in = "index")) a ,Graphs WHERE Graphs.id = a.graphid;'
    var params = [];
    connection.query(queryString, params, function (err, rows, fields) {

      if (err != null) resolve(err)

      resolve(rows)
    });
    //SELECT * FROM `Merchandise` WHERE id = "201805282015"
    connection.end()
  })
}

