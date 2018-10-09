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
    var queryString = 'SELECT * FROM Merchandise'
    var addString = ''
    if(params.filterType == 1){
      //地理位置(筛选)/非距离
      addString = ' WHERE location = ' + params.location
    } else if (params.filterType == 2) {
      //是否开售(筛选)
      addString = ' WHERE avalTime > ' + params.avalTime
    } else if (params.filterType == 3) {
      //使用时间(筛选)
      addString = ' WHERE showTime = ' + params.showTime
    } else if (params.filterType == 4) {
      //使用时间(排序)
      addString = ' WHERE showTime = ' + params.showTime
    } else if (params.filterType == 5) {
      //发布时间(排序)
      addString = ' WHERE addTime = ' + params.addTime
    }
    
    connection.query(queryString, params, function (err, rows, fields) {

      if (err != null) resolve(err)

      resolve(rows)
    });
    connection.end()
  })
}
