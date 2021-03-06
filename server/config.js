const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
  appId: 'wx2be3c27f24305fe4',

    // 微信小程序 App Secret
    appSecret: '',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
      host: '118.25.234.108',
      port: 3306,
      //host: 'd.yinxiangjihua.cn',
      //port: 63583,
      user: 'root',
      database: 'YINXIANG',
      password: 'yinxiangjihua123',//wx2be3c27f24305fe4
      charset: 'UTF8MB4_GENERAL_CI'
    },
    multiMysql: {
      host: '118.25.234.108',
      port: 3306,
     // host: '140.143.92.13',
     // port: 63583,
      user: 'root',
      database: 'YINXIANG',
      password: 'yinxiangjihua123',//wx2be3c27f24305fe4
      charset: 'UTF8MB4_GENERAL_CI',
      multipleStatements: true
    },
    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
