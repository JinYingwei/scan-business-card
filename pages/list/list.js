//引入公用代码
let utils = require('../../utils/util.js')
    //获取应用实例
let app = getApp()


// pages/list/list.js
Page({
    data: {
        letters: [{
            id: 0,
            title: '#'
        }, {
            id: 1,
            title: 'A'
        }, {
            id: 2,
            title: 'B'
        }, {
            id: 3,
            title: 'C'
        }, {
            id: 4,
            title: 'D'
        }, {
            id: 5,
            title: 'E'
        }, {
            id: 6,
            title: 'F'
        }, {
            id: 7,
            title: 'G'
        }, {
            id: 8,
            title: 'H'
        }, {
            id: 9,
            title: 'I'
        }, {
            id: 10,
            title: 'J'
        }, {
            id: 11,
            title: 'K'
        }, {
            id: 12,
            title: 'L'
        }, {
            id: 13,
            title: 'M'
        }, {
            id: 14,
            title: 'N'
        }, {
            id: 15,
            title: 'O'
        }, {
            id: 16,
            title: 'P'
        }, {
            id: 17,
            title: 'Q'
        }, {
            id: 18,
            title: 'R'
        }, {
            id: 19,
            title: 'S'
        }, {
            id: 20,
            title: 'T'
        }, {
            id: 21,
            title: 'U'
        }, {
            id: 22,
            title: 'V'
        }, {
            id: 23,
            title: 'W'
        }, {
            id: 24,
            title: 'X'
        }, {
            id: 25,
            title: 'Y'
        }, {
            id: 26,
            title: 'Z'
        }],
        cardList: {},
        startX: '',
        delBtnWidth: 60,
        moveWidth: '',
        cardNumber: '',
        searchVal: null, //搜索表单
        isChecked: false,
        labelList: [], //标签
        maskShow: true, //遮罩层
        labelVal: '', //标签内容
    },
    //长按显示弹框
    handleShowMenu(e) {
        let id = e.currentTarget.dataset.id,
            tellCell = e.currentTarget.dataset.cell,
            This = this;
        console.log(e);
        wx.showActionSheet({
            itemList: ['导出名片', '柳哨名片', '删除名片'],
            success(res) {
                // 导出名片
                if (res.tapIndex == 0) {

                }
                // 打开柳哨名片
                if (res.tapIndex == 1) {
                    This.openProgress(tellCell)
                }
                // 删除名片
                if (res.tapIndex == 2) {
                    This.deleteUser(id)
                }
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },
    // 导出名片


    // 打开柳哨名片
    openProgress(tel) {
        let This = this
            //查询通用名片相关的名片信息
        wx.request({
            url: utils.baseURL + '/card/scan/get/universalinfo',
            method: 'GET',
            data: {
                tel: tel
            },
            success(res) {
                console.log(res);
                if (res.data.code == 0) {
                    wx.navigateToMiniProgram({
                        appId: 'wx3facaaa31f346d16',
                        path: 'pages/card/person?cardId=' + This.data.cardId,
                        extraData: {
                            //传的数据
                        },
                        envVersion: 'develop',
                        success(res) {
                            // 打开成功
                            if (res.data.code == 0) {
                                console.log('打开成功');
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: '没有注册通用名片',
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    },
    // 删除
    deleteUser(id) {
        // let id = e.currentTarget.dataset.id,
        //     This = this;
        // console.log(e);
        let This = this
        wx.showModal({
            title: '提示',
            content: '是否确认删除',
            success: function(res) {
                if (res.confirm) {
                    console.log('点击确定了');
                    wx.request({
                        url: utils.baseURL + '/card/scan/del/byid',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            id: id
                        },
                        success(res) {
                            if (res.data.code == 0) {
                                This.getCardList()
                                wx.showToast({
                                    title: '成功',
                                    icon: 'success',
                                    duration: 1000
                                })
                            }
                        }
                    })
                } else if (res.cancel) {
                    return false
                }
            }
        })
    },
    //获取名片详细信息
    getCardInfo(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/card/card?id=' + id
        })
    },
    //标签
    newAdd() {
        this.setData({
            isChecked: !this.data.isChecked
        })
    },
    //获取名片列表	
    getCardList() {
        let data = app.globalData
        let This = this
        wx.request({
            url: utils.baseURL + '/card/scan/get/cardlistbyopenid',
            method: 'GET',
            data: {
                openId: data.openId,
                cardName: ''
            },
            success(res) {
                let cardListInfo = res.data.data.data.key
                let n = 0
                Object.keys(cardListInfo).forEach((key) => {
                    n += cardListInfo[key].length
                })

                This.setData({
                    cardList: cardListInfo,
                    cardNumber: n
                })
            }
        })
    },
    //遮罩层显示
    handleAddClick() {
        this.setData({
            maskShow: !this.data.maskShow
        })
    },
    //添加标签
    handleAddLabelClick() {
        let This = this
        let labelList = this.data.labelList;
        let onOff = true
        labelList.map(item => {
            if (item.labelName == This.data.labelVal) {
                wx.showToast({
                    title: '标签不能重名',
                    icon: 'none',
                    duration: 800
                })
                console.log(1);
                onOff = false
            }
            console.log(item.labelName);
        })

        if (this.data.labelVal && onOff) {
            let This = this
            wx.request({
                url: utils.baseURL + '/card/scan/addLabelByOpenId',
                data: {
                    openId: app.globalData.openId,
                    labelName: This.data.labelVal
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'Content-Type': 'application/json'
                }, // 设置请求的 header
                success: function(res) {
                    console.log(res)
                    if (res.data.code == 0) {
                        wx.showToast({
                            title: '标签添加成功',
                            icon: 'success',
                            duration: 800
                        })
                        This.getLabelByOpenId()
                    }
                    This.setData({
                        labelVal: ''
                    })
                },
            })
        }
    },
    // 通过标签获取名片列表
    handleGetList(e) {
        let { id } = e.target.dataset
        let This = this
        wx.request({
            url: utils.baseURL + '/card/scan/get/cardlistbyopenid',
            method: 'GET',
            data: {
                openId: app.globalData.openId,
                labelId: id
            },
            success(res) {
                console.log(res);
                if (res.data.code == 0) {
                    let cardListInfo = res.data.data.data.key
                    let n = 0
                    Object.keys(cardListInfo).forEach((key) => {
                        n += cardListInfo[key].length
                    })
                    This.setData({
                        cardList: cardListInfo,
                        cardNumber: n,
                        searchVal: ''
                    })
                }
            }
        })
    },
    //遮罩层隐藏
    handleCancelClick() {
        this.setData({
            maskShow: true
        })
    },
    //标签表单内容
    handleLabel(e) {
        let item = e.currentTarget.dataset.model;
        this.data.labelVal = e.detail.value

        this.setData({
            [item]: e.detail.value
        });
        console.log(e);
    },
    //删除标签
    handleShowModal(e) {
        let { id } = e.target.dataset
        let This = this
        wx.showModal({
            title: '删除标签',
            content: '是否删除此标签',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.request({
                        url: utils.baseURL + '/card/scan/deleteLabelByOpenId',
                        data: {
                            id,
                            openId: app.globalData.openId
                        },
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }, // 设置请求的 header
                        success: function(res) {
                            console.log(res);
                            if (res.data.code == 0) {
                                wx.showToast({
                                    title: '删除标签成功',
                                    icon: 'success',
                                    duration: 800
                                })
                                This.getLabelByOpenId()
                            }
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 获取当前用户的标签列表
    getLabelByOpenId() {
        let This = this
        wx.request({
            url: utils.baseURL + '/card/scan/getLabelByOpenId',
            method: 'GET',
            data: {
                openId: app.globalData.openId
            },
            success(res) {
                let { labelList } = res.data.data

                app.globalData.labelList = labelList
                if (res.data.code == 0) {
                    This.setData({
                        labelList
                    })
                }
            }
        })
    },
    // 表单触发焦点
    handleTagHide() {
        this.setData({
            isChecked: false
        })
    },
    // 搜索
    handleSearch(e) {
        let data = app.globalData
        let item = e.currentTarget.dataset.model;
        let inpVal = e.detail.value
        let This = this
        this.setData({
            [item]: e.detail.value
        });
        wx.request({
            url: utils.baseURL + '/card/scan/get/cardlistbyopenid',
            method: 'GET',
            data: {
                openId: data.openId,
                cardName: inpVal
            },
            success(res) {
                let { data } = res
                let { key } = data.data.data

                if (data.code == 0 && data.data.data.key) {
                    let n = 0
                    for (var first in key) {
                        n = key[first].length
                    }

                    This.setData({
                        cardList: key,
                        cardNumber: n
                    })
                }
            }
        })
    },
    onLoad() {
        this.getCardList()
        this.getLabelByOpenId()
    },
    onShow() {
        this.getCardList()
    }
})