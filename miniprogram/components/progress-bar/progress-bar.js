// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0

//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()

let currentSec = -1   //当前的秒数

let duration = 0   //以秒为单位的，当前歌曲总时长

let isMoving = false  //表示进度条是否在拖拽，解决：当进度条拖动时和updatetime事件有冲突问题

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime:'00:00',
      totalTime: '00:00',
    },
    movableDis: 0,
    progress: 0,
  },

  lifetimes: {
    ready() {
      this._getMovableDis()
      this._bindBGMEvent()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //拖到触发的函数
    onChange(event){
      // console.log(event)
      if(event.detail.source == 'touch') {
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
        console.log('change', isMoving)
      }
    },
    onTouchEnd(){
        const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
        this.setData({
          progress: this.data.progress,
          movableDis: this.data.movableDis,
          ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec,
        })
      backgroundAudioManager.seek(duration *this.data.progress /100)
      isMoving = false
      console.log('end', isMoving)
    },
    _getMovableDis(){
      //获取宽度
      // 注意：在组件中不是用wx.createSelectorQuery(在pages中)而是用this.createSelectorQuery()
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) =>{
        // console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        // console.log(movableAreaWidth, movableViewWidth)
      })
    },
  
  _bindBGMEvent(){
    backgroundAudioManager.onPlay(() => {
      console.log('onPlay')
      isMoving = false
    })

    backgroundAudioManager.onStop(() => {
      console.log('onStop')
    })

    backgroundAudioManager.onPause(() => {
      console.log('Pause')
    })

    backgroundAudioManager.onWaiting(() => {
      console.log('onWaiting')
    })

    backgroundAudioManager.onCanplay(() => {
      console.log('onCanplay')
      // console.log(backgroundAudioManager.duration)
      if (typeof backgroundAudioManager.duration != 'undefined') {
        this._setTime()
      }else{
        setTimeout(() =>{
          this._setTime()
        },1000)
      }
      
      // if ( backgroundAudioManager.duration !== undefined) {
      //   this._setTime()
      // } else {
      //   setTimeout(() => {
      //     this._setTime()
      //   }, 1000)
      // }

    })
      //监听背景音频播放进度更新事件，只要音乐在播放就会触发事件
    backgroundAudioManager.onTimeUpdate(() => {
      // console.log('onTimeUpdate')
      if(!isMoving) {
        //获取当前歌曲播放的时间，单位是秒，调用转化函数 _dateFormat()
        const currentTime = backgroundAudioManager.currentTime
        //获取对应歌曲总时长
        const duration = backgroundAudioManager.duration
        // console.log(currentTime)
        //防止频繁更新，达到优化的目的
        const sec = currentTime.toString().split('.')[0]
        if (sec != currentSec) {
          // console.log(currentTime)
          const currentTimeFmt = this._dateFormat(currentTime)
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
            progress: currentTime / duration * 100,
            //给对象里的属性单独赋值
            ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
          })
          currentSec = sec


          //联动歌词,  把currentTime传到调用该组件的位置（player.wxml）
          this.triggerEvent('timeUpdate', {
            currentTime
          })
        }
      }
    })

    backgroundAudioManager.onEnded(() => {
      console.log('onEnded')
      //自定义一个事件抛出，播放完进度条播放下一曲（player.wxml）
      this.triggerEvent('musicEnd')
    })

    backgroundAudioManager.onError((res) =>{
      console.log(res.errMsg)
      console.log(res.errCode)
      wx.showToast({
        title: '错误' + res.errCode,
      })
    })

  },
  
  //显示时间
  _setTime(){
    duration = backgroundAudioManager.duration
    console.log(duration)
    const durationFmt = this._dateFormat(duration)
    console.log(durationFmt)
    this.setData({
      ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
    })
  },

  //格式化时间为分、秒
  _dateFormat(sec) {
    //分
    const min = Math.floor(sec / 60)
    //秒
    sec = Math.floor(sec % 60)
    return {
      'min': this._parse0(min),
      'sec': this._parse0(sec),
    }
  },
  //补零
  _parse0(sec){
    return sec < 10 ? '0' + sec : sec
  }


  }
})
