//app.js
const config = require('config')
import request from './utils/wxRequest.js'
const wxRequest = new request

App({
  onLaunch: function () {
    // 展示本地存储能力
    console.log("launched")
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var globalData = this.globalData
    globalData.loginDone = false
    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          var promise = wxRequest.getRequest(config.service.loginUrl, { code: res.code }, { 'content-type': 'application/json' })//sec:965c3c5f305c54ce7df189c250f70559
          promise.then( // 这里要在login之前结束 
            function (rev) {
              console.log(rev)
              globalData.openid = rev.data.openid
              globalData.session_key = rev.data.session_key
              console.log('applogin')
              console.log(globalData.loginDone)
              if (globalData.loginDone != true){
                try{
                  globalData.loginCallBack()
                  globalData.loginDone = true
                }catch(e){
                  console.log(e)
                  console.log(globalData)
                  if (globalData.openid) {
                    // console.log(globalData.openid)
                    // var serverUri = this.data.serverUri
                    // var useropenidJson = { openid: globalData.openid }
                    // var header = { 'content-type': 'application/json' }
                    // var queryOneUser = wxRequest.getRequest(serverUri + '/queryOneUser', useropenidJson, header)
                  }
                }
              }
            }, function (rej) {
              if (rej.statusCode == 502){
                wx.navigateTo({
                  url: '/pages/error/error?errCode=' + rej.statusCode + "&errMsg="+rej.error
                })
              }else{
                wx.navigateTo({
                  url: '/pages/error/error?errCode=' + rej.statusCode + "&errMsg=" + rej.error
                })
              }
            }
          )
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    console.log("launch over")
  },
  // onHide: function(){//临时
  //   if (this.globalData.preOrderingId){
  //     console.log("ordering out")
  //     this.refillAmount(this.globalData.preOrderingId, this.globalData.preOrderingAmount)
  //   }
  // },
  // refillAmount: function (merchid, amount) {
  //   var updateData = {
  //     id: merchid,
  //     amount: amount
  //   }
  //   var amountUpdate = wxRequest.getRequest(app.globalData.serverUri + "/refillMerch", updateData, {})
  //   amountUpdate.then(this.amountUpdateSuccessful, this.amountUpdateFail)
  //   console.log("恢复商品可购买数量：" + this.data.amountHold)

  // },
  globalData: {
    userInfo: null,
    openid: null,
    session_key:null
  }
})