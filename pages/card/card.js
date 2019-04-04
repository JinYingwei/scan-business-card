//引入公用代码
let utils = require('../../utils/util.js')
    //获取应用实例
let app = getApp()
    // pages/card.js
Page({
    data: {
        items: [], //存标签
        formItem: {},
        desc: '', //备注
        // picUrl: '', //
        mask: false, //mask
        exportBook: true, //通讯录图 显示 隐藏
        exportCard: true, //名片图片 显示 隐藏
        cardId: '',
        tel: '', //存手机号
        id: '', //用来确保是修改还是添加的id
        onOff: false,
        is: true
    },
    onLoad: function(options) {
        this.data.cardId = options.id
        if (options.id) {
            this.cardbyid(options.id)
        }
        let list = wx.getStorageSync('list')
        if (!options.id) {
            this.setData({
                items: list,
                formItem: app.globalData.formItem,
            })
        } else {
            this.setData({
                formItem: app.globalData.formItem,
                items: app.globalData.labelList
            })
        }
    },
    checkboxChange(e) {
        this.data.labelChecked = e.detail.value
        console.log(this.data.labelChecked);
    },
    //返回
    navigateBack() {
        wx.navigateBack({
            delta: 1,
        })
    },
    // 预览
    handlePreview() {
        let This = this
        wx.previewImage({
            current: This.data.formItem.cardImgUrl, // 当前显示图片的http链接
            urls: [This.data.formItem.cardImgUrl] // 需要预览的图片http链接列表
        })
    },
    // 通过id获取名片信息
    cardbyid(id) {
        let This = this
        wx.request({
            url: utils.baseURL + '/card/scan/get/cardbyid',
            method: 'GET',
            data: {
                id,
                openId: app.globalData.openId
            },
            success(res) {
                This.data.id = res.data.data.id
                let totalLabels = res.data.data.labelList //全部标签
                let currentLabels = res.data.data.addedLabelList //选择标签


                // totalLabels.map((item,index)=>{
                // 	currentLabels.map((item,index)=>{

                // 	})
                // })


                for (let index = 0; index < totalLabels.length; index++) {
                    const element = totalLabels[index];
                    for (let j = 0; j < currentLabels.length; j++) {
                        const element2 = currentLabels[j];
                        if (element.id == element2.id) {
                            console.log(element2);
                            totalLabels[index].checked = true
                        }
                    }
                }


                // totalLabels.forEach((item,index)=>{
                // 	if(item.id == currentLabels[index].id){
                // 		console.log(item);
                // 		totalLabels[index].checked = true
                // 	}else{
                // 		totalLabels[index].checked = false
                // 	}
                // })

                console.log(totalLabels);
                console.log(currentLabels);
                // This.items = totalLabels
                This.setData({
                    formItem: res.data.data,
                    is: false,
                    items: totalLabels
                })
            }
        })
    },
    //点击保存按钮
    onSave(e) {
        if (!this.data.id) {
            this.saveClick()
        } else {
            this.modifyClick()
        }
        wx.navigateTo({
            url: '../camera/camera'
        })
    },
    //监听表单变化
    inputWacth(e) {
        let item = e.currentTarget.dataset.model;
        this.setData({
            [item]: e.detail.value
        });
    },
    //修改
    modifyClick() {
        var This = this
        if (This.data.formItem.telCell) {
            wx.request({
                url: utils.baseURL + '/card/scan/update/cardcollection',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    id: This.data.id,
                    openId: app.globalData.openId,
                    unionId: app.globalData.unionId,
                    cardName: This.data.formItem.cardName,
                    cardCompany: This.data.formItem.cardCompany,
                    cardAddr: This.data.formItem.cardAddr,
                    cardDepartment: This.data.formItem.cardDepartment,
                    cardTitle: This.data.formItem.cardTitle,
                    cardEmail: This.data.formItem.cardEmail,
                    telWork: This.data.formItem.telWork,
                    telCell: This.data.formItem.telCell,
                    remark: This.data.formItem.remark,
                    cardImgUrl: This.data.formItem.cardImgUrl,
                    labelIds: This.data.labelChecked
                },
                success(res) {
                    if (res.data.code == 0) {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 1000
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '手机不能为空',
                icon: 'none',
                duration: 1000
            })
        }
    },
    //保存
    saveClick() {
        var This = this
        if (This.data.formItem.telCell) {
            wx.request({
                url: utils.baseURL + '/card/scan/add/cardcollection',
                method: 'POST',
                data: {
                    // id:This.data.formItem.id,
                    openId: app.globalData.openId,
                    unionId: app.globalData.unionId,
                    cardName: This.data.formItem.cardName, //名字
                    cardCompany: This.data.formItem.cardCompany, //公司
                    cardAddr: This.data.formItem.cardAddr, //地址
                    remark: This.data.formItem.remark, //备注
                    cardTitle: This.data.formItem.cardTitle, //职位
                    cardEmail: This.data.formItem.email, //邮箱
                    telWork: This.data.formItem.telWork, //添加号码||固定电话
                    telCell: This.data.formItem.telCell, //手机号
                    cardDepartment: This.data.formItem.cardDepartment, //部门
                    cardImgUrl: This.data.formItem.cardImgUrl, //图片
                    labelIds: This.data.labelChecked
                },
                success(res) {
                    if (res.data.code == 0) {
                        This.data.onOff = true
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 1000
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '手机不能为空',
                icon: 'none',
                duration: 1000
            })
        }
    },


    //添加手机通讯录联系人
    // addressBook() {
    //     let cardData = this.data.formItem
    //     let phoneNumber = cardData.telCell.slice(0, cardData.telCell.length - 1)
    //     wx.addPhoneContact({
    //         firstName: cardData.cardName.slice(1, cardData.cardName.length),
    //         lastName: cardData.cardName.slice(0, 1),
    //         mobilePhoneNumber: phoneNumber,
    //         success(res) {
    //             wx.showToast({
    //                 title: '导出通讯录成功',
    //                 icon: 'success',
    //                 duration: 1000
    //             })
    //         }
    //     })
    // },

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

    //                                                     tel: This.data.formItem.telCell
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
    //                                                             icon: 'success',
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
    //     if (this.data.onOff || this.data.id) {
    //         this.addressBook()
    //         this.universalCard()
    //     } else {
    //         wx.showToast({
    //             title: '您尚未保存',
    //             icon: 'none',
    //             duration: 1000
    //         })
    //     }
    // },
    // 打开柳哨名片
    // openProgress() {
    //     let This = this
    //         //查询通用名片相关的名片信息
    //     wx.request({
    //         url: utils.baseURL + '/card/scan/get/universalinfo',
    //         method: 'GET',
    //         data: {
    //             tel: This.data.tel
    //         },
    //         success(res) {
    //             console.log(res);
    //             if (res.data.code == 0) {
    //                 wx.navigateToMiniProgram({
    //                     appId: 'wx3facaaa31f346d16',
    //                     path: 'pages/card/person?cardId=' + This.data.cardId,
    //                     extraData: {
    //                         //传的数据
    //                     },
    //                     envVersion: 'develop',
    //                     success(res) {
    //                         // 打开成功
    //                         console.log('打开成功');
    //                     }
    //                 })
    //             } else {
    //                 wx.showToast({
    //                     title: '没有注册通用名片',
    //                     icon: 'none',
    //                     duration: 1000
    //                 })
    //             }
    //         }
    //     })
    // },
})