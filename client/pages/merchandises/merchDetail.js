const app = getApp()
import request from '../../utils/wxRequest.js'
const wxRequest = new request
const appconfig = require('../../config.js')
const serverHost = appconfig.service.serverUri
import toast from '../../utils/toast.js'
const wxToast = new toast
Page({
  data: {
    serverUri: serverHost,
    merchData: {},
    chooseAmount:1,
    minimalAmount:1,
    header: { 'content-type': 'application/json'}
    
  },
  onLoad: function (options) {
    this.setData({
      merchData: JSON.parse(options.merchData)
    })
  },
  checkStatus:function(checkMerchAmount){//session?
    if (app.globalData.baseUser.OPENID == app.globalData.openid ){
      checkMerchAmount()
    }else{
      wxToast.toastSafe_normal('服务器忙，获取个人信息失败')
    }
  },
  buy:function(){
    this.checkStatus(this.queryOneMerchAmount)
  },
  queryAmountSuccessful:function(resolve){
    console.log(resolve)
    var amountData = resolve.data[0]
    var amount = amountData.AMOUNT
    if (amount > 0) {
      this.data.merchData.AMOUNT = amount //刷新数量 
      this.toPreOrder(this.data.merchData)
    } else {
      wxToast.toastSafe_normal('soldout')
    }
  },
  queryAmountFail:function(reject){
    console.log(reject)
  },
  queryOneMerchAmount: function () {
    var queryData = {
      id: this.data.merchData.ID
    }
    var amountQuery = wxRequest.getRequest(this.data.serverUri + "/queryOneMerchAmount", queryData, this.data.header)
    amountQuery.then(this.queryAmountSuccessful, this.queryAmountFail)
  },
  //以下三个方法在另一页面
  createPreOrder: function (merchData, revolve, reject) {
    console.log("create pre order")

    if (this.checkMerchStatues(merchData.id)) {//时间数量可用以后取出数量n
      //todo
      revolve(merchData)
    } else {
      reject()
    }
  },
  createPreOrderSuccessful: function (merchData) {
    console.log("create ok")
    wx.navigateTo({
      url: '../preOrder/preOrder?merchData=' + JSON.stringify(merchData)
    })
  },
  createPreOrderFail: function () {
    console.log("retry please")
  },
  toPreOrder: function (merchData){
   
      wx.navigateTo({
        url: '../preOrder/preOrder?merchData=' + JSON.stringify(merchData),
      })
    
  }
})
