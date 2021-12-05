
var timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 车位数组
    parkingArr: '',
    // 已选择车位数组
    selectArr: '',
    // 已选择车位号
    parkingSpotID: '',
    // 是否显示弹窗
    isShow: false,
    //canvas top  left  width 百分比  caheight 
    top: 10,
    left: 10,
    cawidth: 48,
    caheigth: 20,
    isHidden: false,
    //可移动区域大小
    movableheight: 1200,
    floatwidth: 50,
    floatheight: 22,
    scale:1.3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '正在加载',
    })

      var row = 10;
      var col = 24;
      var parkingArr = new Array(row); //row行
      var src = "parking.png";
      var m = {};
      var s = 0;
      if (row > 13) {
        this.setData({
          movableheight: this.data.movableheight + (row - 13) * 40
        })
      }
      if (row > 10) {
        this.setData({
          floatheight: 22 + (row - 10) * 1.9,
          caheigth: 22 + (row - 10) * 1.9 - 2
        })
      }
      if (col > 20) {
        this.setData({
          floatwidth: 50 + (col - 20) * 2.25,
          cawidth: 50 + (col - 20) * 2.25 - 2
        })
      }
      for (var i = 0; i < row; i++) {
        parkingArr[i] = new Array(col);
        for (var j = 0; j < col; j++) {
          var ss = Math.ceil(Math.random() * col);
          m.num = j;
          m.src = src
          if (ss % j == 1) {
            m.src = "no"
          } else if (ss % j == 3) {
            m.src = "noparking.png"
          } else {
            m.src = src
          }
          parkingArr[i][j] = m;
          m = {}
        }
      }
      this.setData({
        parkingArr: parkingArr
      })
   
    
    console.log(this.data.floatwidth)
    console.log(this.data.floatheight)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  //选择车位
  bindGetSpotLocation: function(e) {
    var that = this;
    var parkingsrc = e.currentTarget.dataset.src;
    var seledata = {
      x: e.currentTarget.dataset.x + 1,
      y: e.currentTarget.dataset.y,
    }
    var src = 'parkingArr[' + e.currentTarget.dataset.x + '][' + e.currentTarget.dataset.y + '].src'
    if (parkingsrc == "parking.png") {
      //console.log(e)
      if (that.data.selectArr.length < 1) {
        var arr = new Array();
        if (that.data.selectArr.length == 0) {
          arr.push(seledata)
        } else {
          arr = that.data.selectArr;
          arr.push(seledata)
        }
        that.setData({
          [src]: "select.png",
          selectArr: arr,
          parkingSpotID: "P" + (e.currentTarget.dataset.x + 1)*100 + e.currentTarget.dataset.y,
        })
        wx.showToast({
          title: "P" + (e.currentTarget.dataset.x + 1)*100 + e.currentTarget.dataset.y,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: 'You can only book 1 spot',
          icon: 'none'
        })
      }

    } else if (parkingsrc == "select.png") {
      let arr = new Array();
      arr = that.data.selectArr;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].x == seledata.x && arr[i].y == seledata.y) {
          arr.splice(i, 1);
        }
      }
      that.setData({
        [src]: "parking.png",
        selectArr: arr,
      })

    } else if (parkingsrc == "noparking.png") {
      wx.showToast({
        title: "This spot is occupied",
        icon: "none"
      })
    }
  },



  

  bindShowparking: function(e) {
    this.setData({
      isShow: !this.data.isShow
    });
  },
 
  togglePopup() {
    this.setData({
      isShow: !this.data.isShow
    });
  },

  binddelete: function(e) {
    var that = this;
    let arrys = that.data.parkingArr;
    let arr = new Array();
    arr = that.data.selectArr;
    arr.splice(e.currentTarget.dataset.index, 1);
    arrys[e.currentTarget.dataset.x - 1][e.currentTarget.dataset.y].src = "parking.png";
    that.setData({
      parkingArr: arrys,
      selectArr: arr
    })
    if (arr.length == 0) {
      that.setData({
        isShow: false
      });
    }
  },
  //移动结束
  touchend: function(e) {
    let that = this;
    timer = setTimeout(function() {
      that.setData({
        isHidden: true
      })
    }, 3500)
  },
  //横向移动
  onChange: function(e) {
    clearTimeout(timer);
    if (this.data.scale == 1.3) {
      console.log(this.data.floatwidth / 50)
      console.log(e)
      this.setData({
        left: 10 + Math.abs(e.detail.x) * 0.2,
        top: 10 + Math.abs(e.detail.y),
        isHidden: false
      })
    } else if (this.data.scale >= 1.4 && this.data.scale <= 1.5) {
      console.log('aaa')
      this.setData({
        left: 10 + Math.abs(e.detail.x) * 0.25,
        top: 10 + Math.abs(e.detail.y) * 0.9,
        isHidden: false
      })
    } else if (this.data.scale >= 1.6 && this.data.scale <= 1.7) {
      this.setData({
        left: 10 + Math.abs(e.detail.x) * 0.4,
        top: 10 + Math.abs(e.detail.y) * 0.8,
        isHidden: false
      })
    } else if (this.data.scale >= 1.8 && this.data.scale <= 1.9) {
      this.setData({
        left: 10 + Math.abs(e.detail.x) * 0.43,
        top: 10 + Math.abs(e.detail.y) * 0.7,
        isHidden: false
      })
    } else if (this.data.scale >= 2.0 && this.data.scale <= 2.2) {
      this.setData({
        left: 10 + Math.abs(e.detail.x) * 0.41,
        top: 10 + Math.abs(e.detail.y) * 0.6,
        isHidden: false
      })
    } else if (this.data.scale >= 2.3 && this.data.scale <= 2.4) {
      this.setData({
        left: 10 + Math.abs(e.detail.x) * 0.5,
        top: 10 + Math.abs(e.detail.y) * 0.5,
        isHidden: false
      })
    } else if (this.data.scale >= 2.5 && this.data.scale <= 2.7) {
      this.setData({
        left: 10 + Math.abs(e.detail.x) * 0.37,
        top: 10 + Math.abs(e.detail.y) * 0.45,
        isHidden: false
      })
    } else {
      this.setData({
        left: 10 + Math.abs(e.detail.x) * 0.35,
        top: 10 + Math.abs(e.detail.y) * 0.38,
        isHidden: false
      })
    }

  },
  //放大比例
  onScale: function(e) {
    console.log(e.detail.scale)
    let num = (e.detail.scale - 1.2) * 10
    if (e.detail.scale <= 1.9) {
      this.setData({
        cawidth: 55 - num,
        caheigth: 280 - num * 10,
        scale: e.detail.scale
      })
    } else if (e.detail.scale >= 2.0 && e.detail.scale <= 2.4) {
      let nums = (e.detail.scale - 2.0) * 20
      this.setData({
        cawidth: 28 - nums,
        caheigth: 180 - nums * 10,
        scale: e.detail.scale
      })

    } else if (e.detail.scale >= 2.5 && e.detail.scale <= 2.6) {
      this.setData({
        cawidth: 20,
        caheigth: 140,
        scale: e.detail.scale
      })
    } else {
      this.setData({
        cawidth: 20,
        caheigth: 120,
        scale: e.detail.scale
      })

    }
  }

})