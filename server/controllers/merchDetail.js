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
  let id = params.id
  return new Promise((resolve,reject) => {
      const config = require('../config')
      var conf = {}
      conf = config.mysql
      var mysql = require('mysql')
      var connection = mysql.createConnection(conf)
      connection.connect(function (err) {
        if (err != null) console.log(err)
      })
      var queryString = 'SELECT * FROM Merchandise WHERE id = ?'
      var params = [id];
      connection.query(queryString, params, function (err, rows, fields) {

        if (err != null) resolve (err)

        resolve(rows)
      });
      //SELECT * FROM `Merchandise` WHERE id = "201805282015"
      connection.end()
  })  
}

// exports.get_search_data = function () {
//   var querystring = require('querystring');
//   var params = querystring.parse(this.req._parsedUrl.query);
//   var action = params.action;
//   var id = params.id;
//   return go(action, id);
// }

// function go(action, id) {
//   var http = require('http');
//   var qs = require('querystring');
//   var data = {
//     action: action,
//     id: id
//   };
//   var content = qs.stringify(data);
//   var http_request = {
//     hostname: '192.168.1.4',
//     port: '8080',
//     path: '/ticketPayment/merchandiseServlet?' + content,
//     method: 'GET'
//   };
//   var req = http.request(http_request, function (response) {
//     var body = '';
//     response.setEncoding('utf-8');
//     response.on('data', function (chunk) {
//       console.log(chunk);
//       body = chunk;
//     });
//     response.on('end', function () {
//       console.log("end");
//       console.log(body);
//     });
//   });

//   req.end();
// }