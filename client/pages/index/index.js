//index.js
//获取应用实例
const app = getApp()
import request from '../../utils/wxRequest.js'
const wxRequest = new request
const appconfig = require('../../config.js')
import toast from '../../utils/toast.js'
const wxToast = new toast
Page({
  data: {
    serverUri: 'https://www.yinxiangjihua.cn/weapp',//'https://www.yinxiangjihua.cn/weapp', //'https://hvb9jjr1.qcloud.la/weapp',
    motto: 'aliIconfont icon-user',//'完善信息',//
    userInfo: {},
    hasUserInfo: false,
    merchList:{},
    mengban: '1',
    error:true,
    swipImgUrls_with_mid:[],
    swipLoaded:false,
    swip: { 
      indicatorDots:true,
      autoplay:true,
      interval:3000,
      duration:500
    },
    swiperText: "加载中"
  },
  //事件处理函数
  onLoad: function () {
    console.log("onload")
    this.setData({
      serverUri: appconfig.service.serverUri
    })
    app.globalData.serverUri = this.data.serverUri
    app.globalData.loginCallBack = this.queryOneUser
    wx.showLoading({
      success: res => {
        this.setData({
          mengban: 0.2
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // 
    } 
    else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getIndexSwiper()
    this.queryIndexMerch()

    if (app.globalData.openid != null && app.globalData.loginDone != true){
      console.log("login in index")
      this.queryOneUser()
      app.globalData.loginDone = true
    }
  },
  getUserInfo: function(e) {
    mask:true,
    wx.showLoading({
      success: res => {
        this.setData({
          mengban: 0.2
        })
      }
    })
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.hideLoading({
          success: res => {
            this.setData({
              mengban: 1
            })
            wx.showToast({
              mask: true,
              title: '授权成功',
              icon: 'success',
              duration: 2000
            })
          }
        });
      },
      fail: res => {
        wx.hideLoading({
          success: res => {
            this.setData({
              mengban: 1
            })
          }
        });
      }
    })
  },
  myOrder:function(){
    if (app.globalData.hasUserInBase){
      wx.navigateTo({
        url: '../myOrderList/myOrderList'
      })
    }else{
      wx.showToast({
        mask: true,
        title: '请先授权',
        icon: 'none',
        duration: 2000
      })
    }
  },
  myInfo:function(){
    console.log("已授权，进入个人页面")
    if (app.globalData.hasUserInBase){
      wx.navigateTo({
        url: '../personal/personal'
      })
    }else{
      wx.navigateTo({
        url: '../personal/account/account'
      })
    }
  },
  toMerchDetailCallbackSuccessful:function(value){
    if (value.statusCode == 200 || value.statusCode == '200') {
      var merchData = value.data[0]
      var merchid = merchData.ID
      wx.navigateTo({
        url: '../merchandises/merchDetail?merchData=' + JSON.stringify(merchData)
      })
    }
  },
  toMerchDetail: function (e) {
    var merchid = e.currentTarget.dataset.merchid
    var serverUri = this.data.serverUri
    var merchIdJson = { id: merchid }
    var header = {'content-type': 'application/json'}
    var promise = wxRequest.getRequest(serverUri + "/onemerch", merchIdJson, header)
    promise.then(this.toMerchDetailCallbackSuccessful)
  },
  queryIndexMerch:function(){
    var serverUri = this.data.serverUri
    var param = {}
    var header = { 'content-type': 'application/json' }
    var promise = wxRequest.getRequest(serverUri + "/queryIndexMerch", param, header)
    promise.then(this.allMerchDetailCallbackSuccessful, this.allMerch_Fail)
  },
  allMerch_Fail:function(value){
    console.log(value)
    if (value.statusCode == 502){
      
    }
  },
  allMerchDetailCallbackSuccessful:function(value){
    console.log(value)
    var datas = value.data
    for(var i = 0; i < datas.length; i++){
      try{
        if (datas[i].GRAPH_BLOB != null){
          var graphic = datas[i].GRAPH_BLOB.data
          datas[i].graphUrl = this.madeIndexGraphUrl(graphic)
        }
      }catch(e){
        console.log(e)
      }
    }
    this.setData({
      merchList: datas
    })
  },
  addUser: function () {
    var serverUri = this.data.serverUri
    var userInfoJson = {
      reg_name : params.reg_name,
      reg_phone : params.reg_phone,
      nickname : params.nickname,
      openId : params.openId,
      avatarUrl : params.avatarUrl
    }
    var header = { 'content-type': 'application/json' }
    var promise = wxRequest.getRequest(serverUri + "/addUser", userInfoJson, header)
  },
  queryOneUser:function(){
     if (app.globalData.openid) {
      var serverUri = this.data.serverUri
      var useropenidJson = { openid: app.globalData.openid }
      var header = { 'content-type': 'application/json' }
      var queryOneUser = wxRequest.getRequest(serverUri + '/queryOneUser', useropenidJson, header)
       queryOneUser.then(this.queryOneUserSuc,this.queryOneUserFail)
      // wx.hideLoading({
      //   success: res => {
      //     this.setData({
      //       mengban: 1
      //     })
      //   }
      // })
    }else{
      wx.hideLoading({
        success: res => {
          this.setData({
            mengban: 1
          })
        }
      })
    }
  },
  queryOneUserSuc:function(data){
    console.log(data)
    if (data.data.length == 0 || data.data.code) {
      console.log('没有找到这个用户')
      app.globalData.hasUserInBase = false
      this.setData({
        hasUserInBase:false
      })
    } else {
      console.log('找到了这个用户')
      app.globalData.hasUserInBase = true
      app.globalData.baseUser = data.data[0]
      this.setData({
        motto: "aliIconfont icon-user",
        hasUserInBase: true
      })
    }
    wx.hideLoading({
      success: res => {
        this.setData({
          mengban: 1
        })
      }
    })
  },
  queryOneUserFail:function(err){
    console.log(err)
    if (err.errno == 1045){
      wxToast.toastSafe_short('数据库错误')
    }
  },
  changeMottoData:function(){
    this.setData({ motto: 'aliIconfont icon-user'})
  },
  getIndexSwiper:function(){
    var promise = wxRequest.getRequest(app.globalData.serverUri + "/indexSwipper2", {}, {})
    promise.then(this.getIndexSwiperSuccessful, this.getIndexSwiperFail)
  },
  getIndexSwiperSuccessful:function(result){
    console.log(result)
    this.setData({ swipLoaded : true})
    var graphics = result.data
    if(graphics.code == -2){
      var graphic = appconfig.service.imgErrorPic_64
      this.madeUrl(graphic)
    }else{
      this.madeUrls(graphics)
    }
    
  },
  tomap:function (){
    wx.navigateTo({
      url: '../map/map',
    })
  },
  toAllMerchList:function(){
    wx.navigateTo({
      url: '../merchList/merchList',
    })
  },
  getIndexSwiperFail:function(rej)
  {
    console.log(rej)
    this.setData({
      swiperText:"超时"
    })
  },
  madeUrl: function (graphic) {
    // graphics[graphics.length] = {data:''}//测试
    var urls = []
    var urls_with_id = []
    var img64 = wx.arrayBufferToBase64(graphic)
    if (img64 == null || img64.length == 0) {
       img64 = appconfig.service.imgErrorPic_64
    }
    urls_with_id[urls_with_id.length] = {
      merchid: null,
      data64: 'data:image/png;base64,' + img64 //卡顿
    }

    // urls[0] = 'http://pic.jia360.com/ueditor/jsp/upload/201612/01/35741480574582640.jpg'
    // urls[1] = 'https://indexswiper-1256803452.cos.ap-beijing.myqcloud.com/swiper_1.jpg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDWoCcexIG0paklJVtkpGvFFqjYw14akWF%26q-sign-time%3D1531229733%3B1531231533%26q-key-time%3D1531229733%3B1531231533%26q-header-list%3D%26q-url-param-list%3D%26q-signature%3D206aacc8282a762601a28697714390744f6dbbd8&token=1d04292c0b7c42fca53b3fc4566b81530165eb6610001&clientIP=114.245.171.185&clientUA=fcf0c313-a398-426a-ac4f-b0521e541c84'

    this.setData({
      swipImgUrls_with_mid: urls_with_id
    })
    console.log(this.data.swipImgUrls_with_mid)

  },
  madeUrls: function (graphics){
   // graphics[graphics.length] = {data:''}//测试
    var urls = []
    var urls_with_id = []
    for (var i = 0; i < graphics.length; i++) {
      var img64 = wx.arrayBufferToBase64(graphics[i].GRAPH_BLOB.data)
      if (img64 == null || img64.length == 0){
        img64 = appconfig.service.imgErrorPic_64
      }
      urls_with_id[urls_with_id.length] = { 
        merchid: graphics[i].MERCHID,
        data64: 'data:image/png;base64,' + img64 //卡顿
      }
      
    }
    
    // urls[0] = 'http://pic.jia360.com/ueditor/jsp/upload/201612/01/35741480574582640.jpg'
    // urls[1] = 'https://indexswiper-1256803452.cos.ap-beijing.myqcloud.com/swiper_1.jpg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDWoCcexIG0paklJVtkpGvFFqjYw14akWF%26q-sign-time%3D1531229733%3B1531231533%26q-key-time%3D1531229733%3B1531231533%26q-header-list%3D%26q-url-param-list%3D%26q-signature%3D206aacc8282a762601a28697714390744f6dbbd8&token=1d04292c0b7c42fca53b3fc4566b81530165eb6610001&clientIP=114.245.171.185&clientUA=fcf0c313-a398-426a-ac4f-b0521e541c84'

    this.setData({
      swipImgUrls_with_mid: urls_with_id
    })
    console.log(this.data.swipImgUrls_with_mid)
   
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
  test:function(){
    var serverUri = this.data.serverUri

    var header = { 'content-type': 'application/json' }
    var test = wxRequest.getRequest(serverUri + '/test', {}, header)
    test.then(this.test1, this.test2)
  },
  test1:function(r){
    console.log(r)
  },
  test2: function (e) {
    console.log(e)
  }
})
