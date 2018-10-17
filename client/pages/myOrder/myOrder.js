// pages/myOrder/myOrder.js
const app = getApp()
import request from '../../utils/wxRequest.js'
const wxRequest = new request
const appconfig = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderData = JSON.parse(options.orderData)
    var setOrderUnavaliable = this.setOrderUnavaliable
    var destroyTime = orderData.destroyTime
    var destroyDT = new Date(destroyTime)
    var showDestroyTime = destroyDT.toLocaleString()
    orderData.showDestroyTime = showDestroyTime
    this.setData({
      order: orderData
    })
    var interval = this.orderCheck(this.data.order)
    if (orderData.avaliable){
      setTimeout(function () {
        setOrderUnavaliable
      }, interval)
    }
    
    console.log(orderData)
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  orderCheck: function (order) {
    var destroyTime = order.destroyTime
    var destroyDT = new Date(destroyTime)
    var newdatetime = new Date()
    var avaliable = true
    if (destroyDT.getTime() < newdatetime.getTime()) {
      avaliable = false
    }
    order.avaliable = avaliable
    this.setData({
      order: order
    })
    return newdatetime.getTime() - destroyDT.getTime()
  },

  setOrderUnavaliable:function(){
    var order = this.data.order
    order.avaliable = false
    this.setData({
      order:order
    })
  },

  cancelOrder: function (){
    var cf = this.cancelConfirmed
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          cf()
        } else if (sm.cancel) {
        }
      }
    })
  },
  cancelConfirmed:function(){
    var order = this.data.order
    var updateData = {
      id: order.merchid,
      amount: order.amount
    }
    console.log(updateData)
    var amountUpdate = wxRequest.getRequest(app.globalData.serverUri + "/refillMerch", updateData, {})
    amountUpdate.then(this.amountUpdateSuccessful, this.amountUpdateFail)
    console.log("恢复商品可购买数量：" + order.amount)
  },
  amountUpdateSuccessful:function(result){
    if (result.data.msg == "sql成功"){
      this.updateOrderStatus()
    }
  },
  updateOrderStatus:function(){
    var orderids = this.data.order.id
    var data = {
      orderids: orderids,
      to: 2
    }

    var update = wxRequest.getRequest(app.globalData.serverUri + "/updatePreOrderStatus", data, {})
    update.then(this.cancelOrderSuccessful, this.updateOrderFail)
  },

  cancelOrderSuccessful:function(){
    var order = this.data.order
    order.avaliable = false
    order.payStatus = 2
    this.setData({
      order:order
    })
  }
})