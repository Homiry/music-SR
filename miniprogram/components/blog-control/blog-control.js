let userInfo = {}

const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object,
  },

externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,  //表示登录组件是否显示
    modalShow: false,  //底部弹出层是否显示
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      //判断用户是否授权,wx.getSetting 获取用户当前的授权状态
      wx.getSetting({
        success: (res) => {
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                //显示评论弹出层
                this.setData({
                  modalShow: true,
                })
              }
            })
          } else {
            this.setData({
              loginShow: true,
            })
          }
        }
      })
    },

    onLoginsuccess(event){
      //注意：如果之前没有授权，点击允许授权后也应该获取用户的信息
      userInfo = event.detail

      //如果成功授权框消失，评论框弹出
      this.setData({
        loginShow: false,
      }, ()=>{
        this.setData({
          modalShow: true
        })
      })
    },
    onLoginfail(){
      wx.showModal({
        title: '授权用户才能进行评论',
        content: '',
      })
    },

    // onInput(event) {
    //   this.setData({
    //     content: event.detail.value
    //   })
    // },

    onSend(event){
      console.log(event)
      // let formId = event.detail.formId
      let content = event.detail.value.content
      if(content.trim() == ''){
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '',
        mask: true
      })
      //插入数据库（在小程序端才能自带——openid,在云函数中插入要手动写）
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickname: userInfo.nickname,
          avatarUrl: userInfo.avatarUrl,
        }
      }).then((res) => {
        


        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow: false,
          content: '',
        })
        //抛出事件 父元素刷新评论页面
        this.triggerEvent('refreshCommentList')
      })
    },

    

  }
})
