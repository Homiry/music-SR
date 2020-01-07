//获取从pages/miusiclist中获取的缓存数据
let musiclist = []

//正在播放歌曲的index
let nowPlayingIndex = 0
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()

const app =getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,  //false表示不播放
    isLyricShow: false, //表示当前歌词是否显示，false表示不显示
    lyric: '',
    isSame: false, //表示歌曲是否为同一首歌，false表示不是
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options)
      nowPlayingIndex = options.index
      musiclist = wx.getStorageSync('musiclist')
    //把实参传到下面去
    this._loadMusicDetail(options.musicId)
  },

  _loadMusicDetail(musicId){
    if (musicId == app.getPlayMusicId(musicId)){
      this.setData({
        isSame: true
      })
    }
    //不是同一首歌曲才执行：下面的方法实现切换时先停止上一首再加载下一首的优化效果
    if(!this.data.isSame){
      backgroundAudioManager.stop()
    }
    
    let music = musiclist [nowPlayingIndex]
    console.log(music)
    //把歌曲名字显示在导航栏上
    wx.setNavigationBarTitle({
      title: music.name,
    })
    
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
    })
      console.log(musicId, typeof musicId)
    app.setPlayMusicId(musicId)

    wx.showLoading({
      title: '歌曲加载中',
    })

    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicUrl',
        //前面的是event.musicId。后面的是传递给形参的实参数据（ES6的语法：前后两者即属性名和属性值一样可以简写为musicId）
        musicId: musicId,
      }
    }).then((res) => {
      console.log(res)
      console.log(JSON.parse(res.result))
      //
      let result = JSON.parse(res.result)
      if(result.data[0].url == null) {
        wx.showToast({
          title: '无权限播放',
        })
        return this.onNext()
      }
      //不是同一首歌曲才执行
      if(!this.data.isSame){
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name

        //保存播放历史
        this.savePlayHistory()
      }
      
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()

      //加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric',
        }
      }).then((res) => {
        console.log(res)
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if (lrc){
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })

      })
    })
  },

  togglePlaying(){
    //如果正在播放ing
    if (this.data.isPlaying){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  onPrev(){
    nowPlayingIndex--
    if (nowPlayingIndex < 0){
      nowPlayingIndex = musiclist.length - 1
    }
    //调用_loadMusicDetail（）方法
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onNext(){
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length){
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
 //控制封面与歌词的切换
  onChangeLyricShow(){
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  //数据处理函数：把接收到的currentTime传到lyric组件去
  timeUpdate(event){
    //通过选择器 选取组件，然后给它定义的一个update方法传参
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },

  onPlay(){
    this.setData({
      isPlaying: true,
    })
  },

  onPause(){
    this.setData({
      isPlaying: false,
    })
  },

  //保存播放历史
  savePlayHistory(){
    //当前正在播放的歌曲
    const music = musiclist[nowPlayingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    //去重
    let bHave = false
    for(let i = 0, len = history.length; i < len; i++){
      if(history[i].id == music.id){
        bHave = true
        break
      }
    }
    if(!bHave){
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history,
      })
    }
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

  }
})