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
        labelId: '', //存通讯录用户id
        labelCell: '', //存通讯录用户手机
        labelName: '', //用户名
        menuShow: true, //mask菜单
        searchList: [], //搜索列表
        searchNumber: '' //检索后的用户数量
    },
    openWelfare() {
        this.setData({
            isChecked: false,
            searchVal: '',
            searchList: [],
            searchNumber: ''
        })
    },
    // 标签隐藏
    handleTagHidden() {
        this.setData({
            isChecked: false
        })
    },
    //长按显示弹框
    handleShowMenu(e) {
        this.setData({
            menuShow: false,
            isChecked: false
        })
        this.data.labelCell = e.currentTarget.dataset.cell
        this.data.labelId = e.currentTarget.dataset.id
        this.data.labelName = e.currentTarget.dataset.name
            // let id = e.currentTarget.dataset.id,
            //     tellCell = e.currentTarget.dataset.cell,
            //     This = this;
            // console.log(e);
            // wx.showActionSheet({
            //     itemList: ['导出名片', '柳哨名片', '删除名片'],
            //     success(res) {
            //         // 导出名片
            //         if (res.tapIndex == 0) {

        //         }
        //         // 打开柳哨名片
        //         if (res.tapIndex == 1) {
        //             This.openProgress(tellCell)
        //         }
        //         // 删除名片
        //         if (res.tapIndex == 2) {
        //             This.deleteUser(id)
        //         }
        //     },
        //     fail(res) {
        //         console.log(res.errMsg)
        //     }
        // })
    },

    //mask菜单隐藏
    handleMaskHide() {
        this.setData({
            menuShow: true
        })
    },
    //添加手机通讯录联系人
    addressBook() {
        let This = this
            // let cardData = this.data.formItem
            // let phoneNumber = cardData.telCell.slice(0, cardData.telCell.length - 1)
        wx.addPhoneContact({
            // firstName: cardData.cardName.slice(1, cardData.cardName.length),
            // lastName: cardData.cardName.slice(0, 1),
            // mobilePhoneNumber: phoneNumber,
            firstName: This.data.labelName.slice(1, This.data.labelName.length),
            lastName: This.data.labelName.slice(0, 1),
            mobilePhoneNumber: This.data.labelCell,
            success(res) {
                wx.showToast({
                    title: '导出通讯录成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        })
    },

    //导出到通用名片系统
    // universalCard() {
    //     let This = this
    //     let code = '';
    //     wx.login({
    //         success(res) {
    //             if (res.code) {
    //                 code = res.code
    //                 wx.getSetting({
    //                     success(res) {
    //                         if (res.authSetting['scope.userInfo']) {
    //                             // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //                             let iv = '',
    //                                 encryptedData;
    //                             wx.getUserInfo({
    //                                 success(res) {
    //                                     console.log(res)
    //                                     iv = res.iv
    //                                     encryptedData = res.encryptedData
    //                                         //拿unionId
    //                                     wx.request({
    //                                         url: utils.baseURL + '/card/scan/decodeOpenId',
    //                                         method: 'GET',
    //                                         data: {
    //                                             encryptedData,
    //                                             iv,
    //                                             code: code
    //                                         },
    //                                         success(res) {
    //                                             app.globalData.unionId = res.data.data.unionId

    //                                             // let unionId = res.data.data.unionId
    //                                             wx.request({
    //                                                 url: utils.baseURL + '/card/scan/export/touniversal',
    //                                                 method: 'POST',
    //                                                 data: {
    //                                                     // unionId,
    //                                                     unionId: app.globalData.unionId,
    //                                                     tel: This.data.labelCell
    //                                                         // tel: This.data.formItem.telCell
    //                                                 },
    //                                                 success(res) {
    //                                                     //导出通用名片
    //                                                     if (res.data.code == 0) {
    //                                                         wx.showToast({
    //                                                             title: '导出通用名片成功',
    //                                                             icon: 'success',
    //                                                             duration: 1000
    //                                                         })
    //                                                     } else {
    //                                                         wx.showToast({
    //                                                             title: '您还未注册通用名片，导入失败',
    //                                                             icon: 'none',
    //                                                             duration: 1000
    //                                                         })
    //                                                     }
    //                                                 }
    //                                             })
    //                                         }
    //                                     })
    //                                 }
    //                             })
    //                         }
    //                     }
    //                 })
    //             }
    //         }
    //     })
    // },

    //导出
    // exportCard() {
    //     this.universalCard()

    //     this.addressBook()

    //     // if (this.data.onOff || this.data.id) {
    //     //     this.addressBook()
    //     //     this.universalCard()
    //     // } else {
    //     //     wx.showToast({
    //     //         title: '您尚未保存',
    //     //         icon: 'none',
    //     //         duration: 1000
    //     //     })
    //     // } 
    // },
    // 打开柳哨名片
    openProgress(tel) {
        let This = this
            //查询通用名片相关的名片信息
        wx.request({
            url: utils.baseURL + '/card/scan/get/universalinfo',
            method: 'GET',
            data: {
                // tel: tel
                tel: This.data.labelCell
            },
            success(res) {
                if (res.data.code == 0) {
                    wx.navigateToMiniProgram({
                        appId: 'wx3facaaa31f346d16',
                        path: '/pages/card/person/index/index?cardId=' + This.data.cardId,
                        extraData: {
                            //传的数据
                        },
                        // envVersion: 'develop',
                        success(res) {
                            // 打开成功
                            if (res.data.code == 0) {
                                console.log('打开成功');
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: '没有注册柳哨名片',
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    },
    // 删除
    deleteUser(id) {
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
                            // id: id
                            id: This.data.labelId
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
        this.setData({
            isChecked: false,
            searchList: [],
            searchNumber: '',
            searchVal: ''
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

        if (this.data.labelVal == '') {
            wx.showToast({
                title: '标签不能为空',
                icon: 'none',
                duration: 800
            })
        }

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
                        searchList: cardListInfo,
                        searchNumber: n,
                        searchVal: '',
                        isChecked: false
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
                    // 检索为空值触发
                if (data.code == 0 && !inpVal) {
                    This.setData({
                        searchList: [],
                        searchNumber: 0
                    })
                    return
                }
                if (data.code == 0 && data.data.data.key) {
                    let n = 0
                    for (var first in key) {
                        n = key[first].length
                    }

                    This.setData({
                        searchList: key,
                        searchNumber: n
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