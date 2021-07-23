// pages/album/album.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumListData:{},
    albunId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    console.log(eventChannel)
    eventChannel.on('acceptDataFromOpenerPage', function(itemObject) {
      console.log(itemObject)
      that.getAlbum(itemObject)
    })
  },
  // 前往歌曲详情
  toSongDetail(event){
    wx.navigateTo({
      // url: '/pages/songDetail/songDetail?song='+JSON.stringify(song),
      url: '/pages/songDetail/songDetail?id='+event.currentTarget.dataset.id,
    })
  },
  // 获取轮播图具体数据
  async getAlbum(itemObject){
       // 专辑
       let albumListData = await request('/album',{id:itemObject.id})
       // 在这里一定要注意的是通过emit传递过来的参数数据类型是对象
       console.log(albumListData)
       this.setData({
         albumListData:albumListData
       })
  
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