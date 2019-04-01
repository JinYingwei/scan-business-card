//引入公用代码
let utils = require('../../utils/util.js')
//获取应用实例
let app = getApp()
// pages/card.js
Page({
	data: {
		items: [
			{name: 'USA', value: '美国'},
			{name: 'CHN', value: '中国', checked: 'true'},
			{name: 'BRA', value: '巴西'},
			{name: 'JPN', value: '日本'},
			{name: 'ENG', value: '英国'},
			{name: 'TUR', value: '法国'},
		],
		formItem: {},
		desc: '', //备注
		url: '', //网址
		mask: false,	//mask
		exportBook: true,	//通讯录图 显示 隐藏
		exportCard: true,	//名片图片 显示 隐藏
		cardId: '',
		tel:'',//存手机号
		id:'',	//用来确保是修改还是添加的id
		onOff:false,
		url : 'http://tymp-bucket.oss-cn-beijing.aliyuncs.com/exter/businesscard/collection/oRKLm5dvAp_139E52AIN6b_C_e5E/155409348874518228899.jpg?x-oss-process=image/resize,h_1000'
	},
	onLoad: function(options) {
		this.data.cardId = options.id
		if(options.id){
			this.cardbyid(options.id)
		}
		this.setData({
			formItem: app.globalData.formItem,
			url:app.globalData.formItem.cardImgUrl
		})
		console.log(app.globalData.formItem.cardImgUrl);
	},
	//返回
	navigateBack(){
		wx.navigateBack({
		  delta:1,
		})
	},
	// 预览
	handlePreview(){
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
				id
			},
			success(res) {
				This.data.tel = res.data.data.telCell.slice(0,This.data.tel.length-1)
				This.data.id = res.data.data.id
				console.log(res);
				This.setData({
					formItem: res.data.data
				})
			}
		})
	},
	//点击保存按钮
	onSave(e) {
		if(!this.data.id){
			this.saveClick()
		}else{
			this.modifyClick()
		}
	},
	//监听表单变化
	inputWacth(e){
		let item = e.currentTarget.dataset.model;
		this.setData({
		  [item]: e.detail.value
		});
	},
	//修改
	modifyClick(){
		var This = this
		wx.request({
			url:utils.baseURL + '/card/scan/update/cardcollection',
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			data:{
				id:This.data.id,
				openId:app.globalData.openId,
				unionId:app.globalData.unionId,
				cardName: This.data.formItem.cardName,
				cardCompany: This.data.formItem.cardCompany,
				cardAddr: This.data.formItem.cardAddr, 
				cardDepartment: This.data.formItem.cardDepartment,
				cardTitle: This.data.formItem.cardTitle,
				cardEmail: This.data.formItem.cardEmail, 
				telWork: This.data.formItem.telWork,
				telCell: This.data.formItem.telCell,
				remark: This.data.formItem.remark,
				cardImgUrl: This.data.formItem.cardImgUrl
			},
			success(res){
				if (res.data.code == 0) {
					wx.showToast({
						title: '保存成功',
						icon: 'success',
						duration: 1000
					})
				}
			}
		})
	},
	//保存
	saveClick(){
		var This = this
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
				cardImgUrl: This.data.formItem.cardImgUrl //图片
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
	},
	
	//选择通讯录
// 	handleBookClick(){
// 		this.setData({
// 			exportBook:	false,
// 			exportCard: true
// 		})
// 		//选中通讯录
// 		if(!this.data.exportBook){
// 			//通讯录
// 			let cardData = this.data.formItem
// 			//通讯录手机号
// 			let phoneNumber = cardData.telCell.slice(0,cardData.telCell.length-1)
// 		
// 			// 导出通讯录
// 			wx.addPhoneContact({
// 				firstName : cardData.cardName.slice(1),
// 				lastName: cardData.cardName.slice(0,1),
// 				mobilePhoneNumber : phoneNumber,
// 				success(res){
// 					wx.showToast({
// 						title: '导出通讯录成功',
// 						icon: 'success',
// 						duration: 1000
// 					})
// 				}
// 			})
// 		}
// 	},
// 	// 选择通用名片
// 	handleCardClick(){
// 		this.setData({
// 			exportCard:	false,
// 			exportBook: true
// 		})
// 		let This = this
// 		//选中通用名片
// 		if(!this.data.exportCard){
// 			let code = '';
// 			wx.login({
// 				success(res){
// 					if(res.code){
// 						code = res.code
// 						wx.getSetting({
// 							success(res) {
// 								if (res.authSetting['scope.userInfo']) {
// 									// 已经授权，可以直接调用 getUserInfo 获取头像昵称
// 									let iv = '',
// 										encryptedData;
// 									wx.getUserInfo({
// 										success(res) {
// 											console.log(res)
// 											iv = res.iv
// 											encryptedData = res.encryptedData
// 											//拿unionId
// 											wx.request({
// 												url: utils.baseURL + '/card/scan/decodeOpenId',
// 												method: 'GET',
// 												data: {
// 													encryptedData,
// 													iv,
// 													code: code
// 												},
// 												success(res) {			
// 													let unionId = res.data.data.unionId
// 													wx.request({
// 														url: utils.baseURL + '/card/scan/export/touniversal',
// 														method: 'POST',
// 														data: {
// 															unionId,
// 															// unionId: 'oeSpI6PPQtVcCDLr54BWE5wlwU5Y',
// 															tel: This.data.formItem.telCell
// 														},
// 														success(res){
// 															//导出通用名片
// 															if (res.data.code == 0) {
// 																wx.showToast({
// 																	title: '导出通用名片成功',
// 																	icon: 'success',
// 																	duration: 1000
// 																})
// 															}else{
// 																wx.showToast({
// 																	title: '尚未注册通用名片，导出失败',
// 																	icon: 'none',
// 																	duration: 1000
// 																})
// 															}
// 															console.log(res);
// 														},
// 													})
// 												}
// 											})
// 										}
// 									})
// 								}
// 							}
// 						})
// 					}else{
// 						console.log('登录失败' + res.errMsg);
// 					}
// 				}
// 			})
// 		}
// 	},
	//关闭遮罩层
// 	handleClose(){
// 		this.setData({
// 			mask: false,
// 			exportCard:	true,
// 			exportBook:	true,
// 		})
// 	},

	//添加手机通讯录联系人
	addressBook(){
		let cardData = this.data.formItem
		let phoneNumber = cardData.telCell.slice(0,cardData.telCell.length-1)
		
		wx.addPhoneContact({
			firstName: cardData.cardName.slice(1,cardData.cardName.length),
			lastName: cardData.cardName.slice(0,1),
			mobilePhoneNumber : phoneNumber,
			success(res){
				wx.showToast({
					title: '导出通讯录成功',
					icon: 'success',
					duration: 1000
				})
			}
		})
	},
	
	//导出到通用名片系统
	universalCard(){
		let This = this
		let code = '';
		wx.login({
			success(res){
				if(res.code){
					code = res.code
					wx.getSetting({
						success(res) {
							if (res.authSetting['scope.userInfo']) {
								// 已经授权，可以直接调用 getUserInfo 获取头像昵称
								let iv = '',
									encryptedData;
								wx.getUserInfo({
									success(res) {
										console.log(res)
										iv = res.iv
										encryptedData = res.encryptedData
										//拿unionId
										wx.request({
											url: utils.baseURL + '/card/scan/decodeOpenId',
											method: 'GET',
											data: {
												encryptedData,
												iv,
												code: code
											},
											success(res) {
												console.log(res);
												
												let unionId = res.data.data.unionId
												wx.request({
													url: utils.baseURL + '/card/scan/export/touniversal',
													method: 'POST',
													data: {
														unionId,
														// unionId: 'oeSpI6PPQtVcCDLr54BWE5wlwU5Y',
														tel: This.data.formItem.telCell
													},
													success(res){
														//导出通用名片
														if (res.data.code == 0) {
															wx.showToast({
																title: '导出通用名片成功',
																icon: 'success',
																duration: 1000
															})
														}else{
															wx.showToast({
																title: '您还未注册通用名片，导入失败',
																icon: 'success',
																duration: 1000
															})
														}
													}
												})
											}
										})
									}
								})
							}
						}
					})
				}
			}
		})
	},
	
	//导出
	exportCard() {
		if(this.data.onOff || this.data.id){
			this.addressBook()
			this.universalCard()
		}else{
			wx.showToast({
			  title: '您尚未保存',
			  icon: 'none',
			  duration: 1000
			})
		}	
	},
	// 打开其他程序
	openProgress() {
		let This = this
		//查询通用名片相关的名片信息
		wx.request({
			url:utils.baseURL + '/card/scan/get/universalinfo',
			method:'GET',
			data:{
				tel: This.data.tel
			},
			success(res){
				console.log(res);
				if(res.data.code==0){
					wx.navigateToMiniProgram({
						appId: 'wx3facaaa31f346d16',
						path: 'pages/card/person?cardId=' + This.data.cardId,
						extraData: {
							//传的数据
						},
						envVersion: 'develop',
						success(res) {	
							// 打开成功
							console.log('打开成功');
						}
					})
				}else{
					wx.showToast({
					  title: '没有注册通用名片',
					  icon: 'none',
					  duration: 1000
					})
				}
			}
		})
	},
})
