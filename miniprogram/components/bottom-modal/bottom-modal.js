// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean
  },
  
  options: {
    // apply-shared 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面
    styleIsolation: 'apply-shared',
    //启用多个具名插槽
    multipleSlots: true,
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
    onClose(){
      this.setData({
        modalShow: false,
      })
    }
  }
})
