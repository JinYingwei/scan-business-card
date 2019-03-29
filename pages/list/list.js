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
		cardNumber: ''
	},
	//长按删除
	deleteUser(e) {
		let id = e.currentTarget.dataset.id,
			This = this;
		console.log(e);
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
	//新增
	newAdd() {
		wx.navigateTo({
			url: '/pages/camera/camera'
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
				cardName: data.formItem.cardName
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
	onLoad() {
		this.getCardList()
	},
	onShow(){
		this.getCardList()
	}
})
