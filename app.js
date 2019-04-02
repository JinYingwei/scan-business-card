//引入公用代码
let utils = require('./utils/util.js')

App({
	globalData: {
		appid: 'wx16c59e3f46f296db',
		secret: 'af4256a37e756ec80758260aec75343d',
		openId: '',
		unionId: '',
		code: '',
		labelList:'',	//标签列表
		formItem: {
			cardName: '', //名字
			cardTitle: '', //职位
			telCell: '', //手机
			telWork: '', //添加号码||固定电话
			cardEmail: '', //邮箱
			url: '', //网址
			cardCompany: '', //公司
			cardAddr: '', //地址
			desc: '' //备注
		}
	},
	onLaunch: function() {
		let that = this
		wx.login({
			success(res) {
				if (res.code) {
					that.globalData.code = res.code
					wx.request({
						url: utils.baseURL + '/card/scan/decodeOpenId',
						method: 'GET',
						data: {
							code: res.code,
						},
						success(res) {
							let data = res.data
							if (data.code == 0) {
								that.globalData.openId = data.data.openId
								that.globalData.unionId = data.data.unionId
							}
						}
					})
				} else {
					console.log('登录失败' + res.errMsg)
				}
			}
		})
	},
})
