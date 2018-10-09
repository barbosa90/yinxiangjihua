module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var chunk = await getPaySign()
  ctx.body = chunk
}


var getPaySign = () => {
  return new Promise((resolve, reject) => {
    try{
      var timeStamp = new Date().getTime()
      var crypto = require("crypto")
      var nonceStr = randomStr(crypto,32)
      var paySign = md5(crypto,'appId=wx72c209e92fbd2ea3&nonceStr=' + nonceStr + '&package=prepay_id=这里填写prepayid&signType=MD5&timeStamp=' + timeStamp + '&key=0aeaad70334bc747f8e97f7e5b2d4897')
      paySign = paySign.toUpperCase()
      var result = {
        paySign: paySign,
        nonceStr: nonceStr,
        timeStamp: timeStamp.toString(),
        signType: 'MD5'
      }
      resolve(result)
    }catch(err){
      if(reject) reject(err)
    }
  })
}

function md5(crypto,str) {
  var md5sum = crypto.createHash('md5')
  md5sum.update(str)
  str = md5sum.digest('hex')
  return str
}

function randomStr(crypto,size) {
  size = size || 32;
  var code_string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var max_num = code_string.length + 1;
  var new_pass = ''
  for (var i = 0; i < size; i++) {
    new_pass += code_string.charAt(Math.floor(Math.random() * max_num))
  }
  return new_pass
}