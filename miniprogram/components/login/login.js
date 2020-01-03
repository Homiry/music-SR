// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(event) {
      console.log(event)
      const useInfo = event.detail.userInfo
      //允许授权
      if (useInfo) {
        this.setData({
          modalShow: false
        })
        //自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项
        this.triggerEvent('loginsuccess', useInfo)
      } else {
        this.triggerEvent('loginfail')
      }
    }
  }
})