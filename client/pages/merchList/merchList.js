// client/pages/merchList/merchList.js
import request from '../../utils/wxRequest.js'
const wxRequest = new request
const appconfig = require('../../config.js')
const serverHost = appconfig.service.serverUri
import toast from '../../utils/toast.js'
const wxToast = new toast
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchList:[],
    page: 1,
    quantity: 1,
    region:[],
    condition:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.query_numbersOf_Merch(this.data.quantity,this.data.page)
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
  query_numbersOf_Merch: function (quantity, page) {
    var param = {
      quantity: quantity,
      page : page
    }
    var header = { 'content-type': 'application/json' }
    var promise = wxRequest.getRequest(serverHost + "/somemerch", param, header)
    promise.then(this.someMerchCallbackSuccessful, this.someMerch_Fail)
  },
  someMerch_Fail: function (value) {
    console.log(value)
    if (value.statusCode == 502) {

    }
  },
  someMerchCallbackSuccessful: function (value) {

    var datas = value.data
    if (datas.length == 0){
      wxToast.toastSafe_short("到底了")
      this.data.page--
      return
    }
    for (var i = 0; i < datas.length; i++) {
      try {
        if (datas[i].graph_blob != null) {
          var graphic = datas[i].graph_blob.data
          datas[i].graphUrl = this.madeIndexGraphUrl(graphic)
        }
      } catch (e) {
        console.log(e)
      }
    }
    this.setData({
      merchList: this.addOnArray(this.data.merchList,datas)
    })
  },
  madeIndexGraphUrl: function (graphic) {
    // graphics[graphics.length] = {data:''}//测试
    var img64 = wx.arrayBufferToBase64(graphic)
    if (img64 == null || img64.length == 0) {
      img64 = appconfig.service.imgErrorPic_64
    }

    return 'data:image/png;base64,' + img64 //卡顿

    // urls[0] = 'http://pic.jia360.com/ueditor/jsp/upload/201612/01/35741480574582640.jpg'
    // urls[1] = 'https://indexswiper-1256803452.cos.ap-beijing.myqcloud.com/swiper_1.jpg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDWoCcexIG0paklJVtkpGvFFqjYw14akWF%26q-sign-time%3D1531229733%3B1531231533%26q-key-time%3D1531229733%3B1531231533%26q-header-list%3D%26q-url-param-list%3D%26q-signature%3D206aacc8282a762601a28697714390744f6dbbd8&token=1d04292c0b7c42fca53b3fc4566b81530165eb6610001&clientIP=114.245.171.185&clientUA=fcf0c313-a398-426a-ac4f-b0521e541c84'
  },
  next:function(){
    var condition = this.data.condition
    this.data.page++;
    if (condition == ''){
      
      this.query_numbersOf_Merch(this.data.quantity, this.data.page)
    }else{
      this.queryRegionMerches(this.data.region,this.data.quantity, this.data.page)
    }
    
  },
  addOnArray:function(list,fromList){
    if(list == null){
      list = []
    }
    var start = list.length
    for (var i = 0; i < fromList.length; i++){
      list[start + i] = fromList[i];
    }
    return list;
  },
  bindRegionEvent:function(e){
    console.log(e.detail)//value code 注意此处用微信自带code 是否和config中的对应
    var regionData = e.detail
    var regionCode = regionData.code
    this.setData({
      merchList:[],
      region: regionData.value,
      page : 1
    })
    
    this.queryRegionMerches(regionData.value, this.data.quantity, this.data.page)
  },
  queryRegionMerches: function (regionValue, quantity, page){
 //regionValue目前用三级

    this.setData({
      condition: "region" 
    })
    var params = {
      l: regionValue[0], sl: regionValue[1], el: regionValue[2], quantity: quantity, page: page} 
    var header = { 'content-type': 'application/json' }
    var promise = wxRequest.getRequest(serverHost + "/regionmerch", params, header)
    promise.then(this.regionMerchCallback_Successful, this.regionMerch_Fail)
  },
  regionMerchCallback_Successful:function(result){
    console.log(result)
    
    var newList = result.data
    if (newList.length == 0) {
      wxToast.toastSafe_short("到底了")
      this.data.page--
      return;
    }
    if(result.data.length == 0){
      newList = []
      this.data.page--
      this.setData({
        msg: '无结果'
      })
    }else{
      this.setData({
        msg: ''
      })
    }
   
    this.setData({
      merchList: this.addOnArray(this.data.merchList, newList)
    })
  },
  regionMerch_Fail: function(err){
    console.log(err)
    this.setData({
      msg: '无结果'
    })
  },
  toMerchDetailCallbackSuccessful: function (value) {
    if (value.statusCode == 200 || value.statusCode == '200') {
      var merchData = value.data[0]
      var merchid = merchData.id
      wx.navigateTo({
        url: '../merchandises/merchDetail?merchData=' + JSON.stringify(merchData)
      })
    }
  },
  toMerchDetail: function (e) {
    var merchid = e.currentTarget.dataset.merchid
    var merchIdJson = { id: merchid }
    var header = { 'content-type': 'application/json' }
    var promise = wxRequest.getRequest(serverHost + "/onemerch", merchIdJson, header)
    promise.then(this.toMerchDetailCallbackSuccessful)
  },
  toMerchDetailCallbackSuccessful: function (value) {
    if (value.statusCode == 200 || value.statusCode == '200') {
      var merchData = value.data[0]
      var merchid = merchData.id
      wx.navigateTo({
        url: '../merchandises/merchDetail?merchData=' + JSON.stringify(merchData)
      })
    }
  }
})
