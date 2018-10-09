// pages/bill/bill.js
const app = getApp()
import request from '../../utils/wxRequest.js'
const wxRequest = new request
import toast from '../../utils/toast.js'
const wxToast = new toast


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var selfDestroy = new Date(options.selfDestroy)
    this.setData({
      pre_order_id: options.pre_order_id,
      amountHold: options.amount,
      merchid: options.merchid,
      totalCost: Number(options.totalCost),
      selfDestroy: selfDestroy,
      timerId: this.setTimer(selfDestroy),
      errormsg:"服务器繁忙请重试",
      disAvaliable:false,
      paying:false
    })
    
  },
  setTimer: function (selfDestroyTime){
    var interval = 120000 //2分钟超时
    if (selfDestroyTime != null){
      interval = selfDestroyTime.getTime()
      var now = new Date().getTime()
      interval = interval - now
    }
    //测试
    interval = 5000
      console.log(interval)
    var disAvaliable = this.disAvaliable

    return setTimeout(function () {
      disAvaliable()
     }, interval)
  },
  disAvaliable:function(){
    if(this.data.paying){
      return
    }
    this.setData({
      disAvaliable: true,
      pre_order_id:null,
      errormsg:"支付超时，请重新选择"
    })
    
    this.refillAmount()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('hide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('unload')
    if (!this.data.disAvaliable){
      clearTimeout(this.data.timerId)
      this.refillAmount()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  payapi: function (payObject){
    if(this.data.disAvaliable){
      wxToast.toastSafe_normal('订单已经超时，请重新选择')
      return
    }
    this.setData({
      paying:true
    })
    //var destroyTime = this.data.selfDestroy
    var paySign = payObject.paySign
    var nonceStr = payObject.nonceStr
    var timeStamp = payObject.timeStamp
    var signType = payObject.signType
    var noneDisAvaliable = this.noneDisAvaliable
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: '',//这需要一个统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=* server端也需要填空
      signType: signType,
      paySign: paySign,
      success:function(){
        console.log('成功:支付返回值')
        noneDisAvaliable()
      },
      fail:function(){
        console.log('失败:重试；或者退回，取消订单')
        //判断是否过期  或者直接重新选择  必须refill数量 
      }
    })
   
  },
  cancel:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  refillAmount:function(){//需要测试
    var updateData = {
      id: this.data.merchid,
      amount: this.data.amountHold
    }
    var amountUpdate = wxRequest.getRequest(app.globalData.serverUri + "/refillMerch", updateData, {})
    amountUpdate.then(this.amountUpdateSuccessful, this.amountUpdateFail)
    console.log("恢复商品可购买数量：" + this.data.amountHold)
    
  },
  amountUpdateSuccessful:function(result){
    console.log(result)
  },
  amountUpdateFail: function (err) {
    console.log(err)
  },
  getPaySign_Server: function(){
    wxRequest.getRequest(app.globalData.serverUri + '/getPaySign', {},{}).then(this.setPaySign,function(err){
      console.log(err)
    })
  },
  setPaySign:function(result){
    console.log(result)
    if (result.data.paySign){
      this.payapi(result.data)
    }
  },
  noneDisAvaliable:function(){
    this.setData({
      disAvaliable:true // unload页面的时候就不会refill了
    })
  }
})


