// pages/search/search.js
import request from '../../utils/request'
let isSend = false;//用于函数节流
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'',//placeholder默认值
    hotList:[],
    searchContent:'',
    searchList:[],
    historyList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    this.getSearchHistory()
  },

  // 清空搜索内容
  clearSearchContent(){
    this.setData({
      searchContent:'',
      searchList:[]
    })
  },
  // 回到播客
  toBoke(){
    wx.reLaunch({
      url: '/pages/boke/boke'
    })
  },
  // 删除图标 删除搜索历史记录
  deleteSearchHistory(){
    wx.showModal({
      content:"确定要删除历史记录吗？",
      cancelColor: 'red',
      success:(res)=>{
        if(res.confirm){
          this.setData({
            historyList:[]
          })
          wx.removeStorageSync('history')
        }
      }
    })

  },
    // 获取初始化数据
    async getInitData(){
      let placeholderData = await request('/search/default')
      let hotListData=await request('/search/hot/detail')
      this.setData({
        placeholderContent:placeholderData.data.showKeyword,
        hotList:hotListData.data
      })
    },

    // 表单项内容发生改变的回调函数，注意bindinput是实时函数，bindchange是失去焦点函数
     handeleInputChange(event){
      // console.log(event)
      // 更新用户输入的数据
      this.setData({
        searchContent:event.detail.value.trim()
      })
      // 发请求得到数据,函数防抖节流
      if(isSend){
        return
      }
      isSend=true
      this.getSearchList()
     setTimeout( ()=>{
        isSend=false
      },300)
  

    },
    // 获取搜索数据的功能函数
    async getSearchList(){
      if(!this.data.searchContent){
        this.setData({
          searchList:[]
        })
        return
      }
      let {historyList,searchContent}=this.data
      let searchListData= await request('/search',{keywords:searchContent,limit:10})
      this.setData({
       searchList:searchListData.result.songs
     })
    //  将搜索的关键字添加到历史记录中
    if(historyList.indexOf(searchContent)!==-1){
      historyList.splice(historyList.indexOf(searchContent),1)
    }
      historyList.unshift(searchContent);
      this.setData({
        historyList
      })
    
    wx.setStorageSync('history', historyList)
    },
    // 获取本地历史记录
    getSearchHistory(){
      let historyList =wx.getStorageSync('history')
      if(historyList){
        this.setData({
          historyList
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