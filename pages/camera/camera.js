//引入公用代码
let utils = require('../../utils/util.js')


//获取应用实例
const app = getApp()

Page({
    data: {
        file: '',
        windowWidth: 0,
        windowHeight: 0,
        isShow: true,
        screenWidth: 0,
        screenHeight: 0,
        resizeOnOff: true,
        tempImagePath: '',
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '初见的相契   一张卡片的熟悉',
            path: '/pages/camera/camera',
            imageUrl: 'http://ii.sinelinked.com/miniProgramAssets/card-zf.png',
        }
    },
    // 拍照
    takePhoto() {
        const ctx = wx.createCameraContext()
        let This = this
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {

                This.setData({
                        file: res.tempImagePath,
                        isShow: false
                    }),
                    wx.showLoading({
                        title: '加载中',
                    })

                var tempImagePath = res.tempImagePath
                wx.getImageInfo({
                    src: tempImagePath,
                    success(res) {
                        console.log(res)
                    }
                })
                This.setData({ tempImagePath })
                This.drawCanvas(tempImagePath)
            }
        })
    },

    // 上传
    api(res) {
        var that = this
        wx.uploadFile({
            url: utils.baseURL + '/card/scan/cognizecard',
            filePath: res,
            name: 'file',
            formData: {
                user: 'test',
                unionId: app.globalData.appid,
                openId: app.globalData.openId
            },
            success(res) {
                const data = JSON.parse(res.data).data.cardScan
                wx.hideLoading()
                if (data.telCell) {
                    var obj = data
                    for (var key in data) {
                        if (data[key] != null && key != 'cardImgUrl') {
                            if (data[key].indexOf(',') != -1) {
                                obj[key] = data[key].slice(0, data[key].length - 1)
                            }
                        }
                    }

                    wx.setStorageSync('list', data.labelList)

                    app.globalData.formItem = obj
                    wx.navigateTo({
                        url: '/pages/card/card'
                    })
                } else {
                    wx.showToast({
                        title: '扫描名片失败',
                        icon: 'none',
                        duration: 2000,
                        success() {
                            that.setData({
                                isShow: true,
                            })
                        }
                    })
                }
            },
            fail(err) {
                console.log(err);
                wx.showToast({
                    title: '扫描名片失败',
                    icon: 'none',
                    duration: 2000,
                    success() {
                        that.setData({
                            isShow: true,
                        })
                    }
                })
            }
        })
    },

    drawCanvas(tempFilePaths) {
        var that = this;
        // 绘制图片到canvas上		

        const ctx = wx.createCanvasContext('attendCanvasId');
        let [w, h] = []
        wx.getSystemInfo({
            success(res) {
                w = res.windowWidth
                h = res.windowHeight
            }
        })
        wx.getImageInfo({
            src: tempFilePaths,
            success(res) {
                console.log(res)
                if (res.type == 'png') {
                    // ctx.drawImage(tempFilePaths, 0, 0, res.width / 1.4, res.height / 1.4);
                    ctx.drawImage(tempFilePaths, 0, 0, that.data.windowWidth, that.data.windowHeight);
                } else {
                    ctx.drawImage(tempFilePaths, 0, 0, w, h);
                }
                ctx.draw(false, () => {
                    that.prodImageOpt();
                });
            }
        })
    },
    // 生成图片
    prodImageOpt() {
        var that = this;
        wx.canvasToTempFilePath({
            quality: 1,
            fileType: 'jpg',
            canvasId: 'attendCanvasId',
            success(res) {
                that.api(res.tempFilePath);
            }
        })
    },
    // 打开相册
    openAlbum() {
        let This = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0]
                This.api(tempFilePaths)
            }
        })
    },
    onResize: function(res) {
        console.log('监听', res);
        let w = res.size.windowWidth // 新的显示区域宽度
        let h = res.size.windowHeight // 新的显示区域高度
        this.setData({
            windowHeight: h,
            windowWidth: w
        })
    },
    onShow() {
        try {
            const res = wx.getSystemInfoSync()
            const {
                windowHeight,
                windowWidth
            } = res
            this.setData({
                windowWidth,
                windowHeight
            })
        } catch (e) {

        }
        this.setData({
            isShow: true
        })
    }
})