module.exports = async (ctx, next) => {
  //中间件
  ctx.response.set('Cache-Control', 'no-cache')
  ctx.response.set('Content-Type', 'application/json')
  var querystring = require('querystring')
  var params = querystring.parse(ctx.request.querystring)
  var req = ctx.request
  var chunk = await wxpayApi(params, req, ctx)
  ctx.body = chunk
}


      //   < xml >
      //   <appid>wx2421b1c4370ec43b < /appid>
      //   < attach > 音享计划支付 < /attach>
      //   < body > APP支付 < /body>
      //   < mch_id > 10000100 < /mch_id>
      //   < nonce_str > 1add1a30ac87aa2db72f57a2375d8fec < /nonce_str>
      //     < notify_url > http://wxpay.wxutil.com/pub_v2/pay/notify.v2.php</notify_url>
      // <out_trade_no>1415659990 < /out_trade_no>
      //   < spbill_create_ip > 14.23.150.211 < /spbill_create_ip>
      //     < total_fee > 1 < /total_fee>
      //     < trade_type > APP < /trade_type>
      //     < sign > 0CB01533B8C1EF103065174F50BCA001 < /sign>
      //       < /xml>
var wxpayApi = (params, req, ctx) => {
  var request = require('request')
  var xmlreader = require("xmlreader")

  var wxpay = require('../tools/payUtil')

  return new Promise((resolve, reject) => {
   
    try {
      //支付
      var appid = 'wx72c209e92fbd2ea3'
      var appsecret = '0aeaad70334bc747f8e97f7e5b2d4897'
      var mchid = '1499403456'//
      var mchkey = '8r435jVd7yA0354nsvkxb4cN3x7Se4322'//
      var wxurl = ''//'/weapp/getPaySign'//
      var prepay_id = ''


      //首先拿到前端传过来的参数    
      let orderCode = params.orderID
      let money = params.money
      console.log('APP传过来的参数是', orderCode + '----' + money + '------' + appid + '-----' + appsecret + '-----' + mchid + '-----' + mchkey)     //首先生成签名sign    appid    
      let mch_id = mchid
      let nonce_str = wxpay.createNonceStr()
      let timestamp = wxpay.createTimeStamp()
      let body = '测试微信支付'
      let out_trade_no = orderCode
      let total_fee = money//单位分
      let spbill_create_ip = req.header['x-real-ip']
      let notify_url = wxurl
      let trade_type = 'APP'
      let sign = wxpay.paysignjsapi(appid, body, mch_id, nonce_str, notify_url, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey)
      //另一种加密方式sign = hash_hmac("sha256", stringSignTemp, key).toUpperCase()
      var formData = "<xml>"
      formData += "<appid>" + appid + "</appid>"//appid    
      formData += "<body><![CDATA[" + "测试微信支付" + "]]></body>"
      formData += "<mch_id>" + mch_id + "</mch_id>";  //商户号    
      formData += "<nonce_str>" + nonce_str + "</nonce_str>" //随机字符串，不长于32位。    
      formData += "<notify_url>" + notify_url + "</notify_url>"
      formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>"
      formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
      formData += "<total_fee>" + total_fee + "</total_fee>"
      formData += "<trade_type>" + trade_type + "</trade_type>"
      formData += "<sign>" + sign + "</sign>"
      formData += "</xml>"
      console.log('formData===', formData)
      var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
      // request({ url: url, method: 'POST', body: formData }, function (err, response, body) {
      //   if(prepay_id == ''){
      //     prepay_id = '没有获取到prepay_id'
      //   }
      //   if (!err && response.statusCode == 200) {
      //     reject(err)
      //     console.log(body)
      //     xmlreader.read(body.toString("utf-8"), function (errors, response) {
      //       if (null !== errors) {
      //         reject(errors)
      //         console.log(errors)
      //         return
      //       }
      //       console.log('长度===', response.xml.prepay_id.text().length)
      //       prepay_id = response.xml.prepay_id.text()
      //       console.log('解析后的prepay_id==', prepay_id)
      //       //将预支付订单和其他信息一起签名后返回给前端                
      //       let finalsign = wxpay.paysignjsapifinal(appid, mch_id, prepay_id, nonce_str, timestamp, mchkey)

      //       // res.json({ 'appId': appid, 'partnerId': mchid, 'prepayId': prepay_id, 'nonceStr': nonce_str, 'timeStamp': timestamp, 'package': 'Sign=WXPay', 'sign': finalsign })
           
      //     })
      //   }else{
      //     reject(err)
      //   }
      // })
      var result = {//
        //paySign: sign,
        nonceStr: nonce_str,
        timestamp1: timestamp.toString(),
        signType: 'MD5',
        req: req,
        ctx: ctx,
        prepay_id: prepay_id
      }
      resolve(result)
      
    } catch (err) {
      if (reject) reject(err)
    }
  })
}

function md5(crypto, str) {
  var md5sum = crypto.createHash('md5')
  md5sum.update(str)
  str = md5sum.digest('hex')
  return str
}

function randomStr(crypto, size) {
  size = size || 32;
  var code_string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var max_num = code_string.length + 1;
  var new_pass = ''
  for (var i = 0; i < size; i++) {
    new_pass += code_string.charAt(Math.floor(Math.random() * max_num))
  }
  return new_pass
}

function paysignjsapi (appid, body, mch_id, nonce_str, notify_url, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey) { 
  var ret = { appid: appid, mch_id: mch_id, nonce_str: nonce_str, body: body, notify_url: notify_url, out_trade_no: out_trade_no, spbill_create_ip: spbill_create_ip, total_fee: total_fee, trade_type: trade_type }

  var string1 = raw(ret)
  var key = mchkey
  string1 = string1 + '&key=' + key
  var crypto = require('crypto')
  return crypto.createHash('md5').update(string1, 'utf8').digest('hex').toUpperCase()
}
 
//把金额转为分    
function getmoney(money) {        
  return parseFloat(money) * 100   
}
// 随机字符串产生函数      
function createNonceStr() {        
  return Math.random().toString(36).substr(2, 15)  
}
// 时间戳产生函数      
function createTimeStamp() {        
  return parseInt(new Date().getTime() / 1000) + ''
}

function paysignjsapifinal(appid, mch_id, prepayid, noncestr, timestamp, mchkey) { 
  var ret = { appid: appid, partnerid: mch_id, prepayid: prepayid, package: 'Sign=WXPay', noncestr: noncestr, timestamp: timestamp }   
  var string1 = raw(ret)
  var key = mchkey 
  string1 = string1 + '&key=' + key
  var crypto = require('crypto')
  return crypto.createHash('md5').update(string1, 'utf8').digest('hex').toUpperCase()
}

function getXMLNodeValue(xml) { //没用到？    
  // var tmp = xml.split("<"+node_name+">");        
  // console.log('tmp',tmp);        
  // var _tmp = tmp[1].split("</"+node_name+">");        
  // console.log('_tmp',_tmp);        
  // return _tmp[0];        
  xmlreader.read(xml, function (errors, response) {          
    if (null !== errors) {                
      console.log(errors)                
      return            
    }            
    console.log('长度===', response.xml.prepay_id.text().length)           
    var prepay_id = response.xml.prepay_id.text()
    console.log('解析后的prepay_id==',prepay_id)
    return prepay_id
  })
}

