//引入公用代码
let utils = require('../../utils/util.js')
//获取应用实例
let app = getApp()
// pages/card.js
Page({
	data: {
		formItem: {},
		desc: '', //备注
		url: '', //网址
		mask: false,	//mask
		exportBook: true,	//通讯录图 显示 隐藏
		exportCard: true,	//名片图片 显示 隐藏
		cardId: '',
		tel:'',//存手机号
		id:'',	//用来确保是修改还是添加的id
		animationData: {}
	},
	onLoad: function(options) {
		this.data.cardId = options.id
		if(options.id){
			this.cardbyid(options.id)
		}
		this.setData({
			formItem: app.globalData.formItem
		})
		
	},
	//返回
	navigateBack(){
		wx.navigateBack({
		  delta:1,
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
	handleBookClick(){
		this.setData({
			exportBook:	false,
			exportCard: true
		})
		//选中通讯录
		if(!this.data.exportBook){
			//通讯录
			let cardData = this.data.formItem
			//通讯录手机号
			let phoneNumber = cardData.telCell.slice(0,cardData.telCell.length-1)
		
			// 导出通讯录
			wx.addPhoneContact({
				firstName : cardData.cardName.slice(1),
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
		}
	},
	// 选择通用名片
	handleCardClick(){
		this.setData({
			exportCard:	false,
			exportBook: true
		})
		let This = this
		//选中通用名片
		if(!this.data.exportCard){
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
																	title: '尚未注册通用名片，导出失败',
																	icon: 'none',
																	duration: 1000
																})
															}
															console.log(res);
														},
													})
												}
											})
										}
									})
								}
							}
						})
					}else{
						console.log('登录失败' + res.errMsg);
					}
				}
			})
		}
	},
	//关闭遮罩层
	handleClose(){
		this.setData({
			mask: false,
			exportCard:	true,
			exportBook:	true,
		})
	},
	//导出
	exportCard() {
		this.setData({
			mask: true
		})
		//选中通讯录
// 		if(!this.data.exportBook){
// 			//通讯录
// 			let cardData = this.data.formItem
// 			//通讯录手机号
// 			let phoneNumber = cardData.telCell.slice(0,cardData.telCell.length-1)
// 
// 			// 导出通讯录
// 			wx.addPhoneContact({
// 				firstName : cardData.cardName,
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
// 													console.log(res);
// 													
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
// 															}
// 														}
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
// 		let code = '';
// 		wx.login({
// 			success(res) {
// 				if (res.code) {
// 					code = res.code
// 					console.log(res);
// 				} else {
// 					console.log('登录失败！' + res.errMsg)
// 				}
// 			}
// 		})
// 		let This = this
// 		wx.getSetting({
// 			success(res) {
// 				if (res.authSetting['scope.userInfo']) {
// 					// 已经授权，可以直接调用 getUserInfo 获取头像昵称
// 					let iv = '',
// 						encryptedData;
// 					wx.getUserInfo({
// 						success(res) {
// 							console.log(res)
// 							iv = res.iv
// 							encryptedData = res.encryptedData
// 							//拿unionId
// 							wx.request({
// 								url: utils.baseURL + '/card/scan/decodeOpenId',
// 								method: 'GET',
// 								data: {
// 									encryptedData,
// 									iv,
// 									code: code
// 								},
// 								success(res) {
// 									console.log(res);
// 									
// 									let unionId = res.data.data.unionId
// 									wx.request({
// 										url: utils.baseURL + '/card/scan/export/touniversal',
// 										method: 'POST',
// 										data: {
// 											unionId,
// 											// unionId: 'oeSpI6PPQtVcCDLr54BWE5wlwU5Y',
// 											tel: This.data.formItem.telCell
// 										},
// 										success(res) {	
// 											//通讯录
// 											let cardData = This.data.formItem
// 											//通讯录手机号
// 											let phoneNumber = cardData.telCell.slice(0,cardData.telCell.length-1)
// 					
// 											// 导出通讯录
// 											wx.addPhoneContact({
// 												firstName : cardData.cardName,
// 												mobilePhoneNumber : phoneNumber,
// 												success(res){
// 													wx.showToast({
// 														title: '导出通讯录成功',
// 														icon: 'success',
// 														duration: 1000
// 													})
// 												}
// 											})
// 											
// 											//导出通用名片
// 											if (res.data.code == 0) {
// 												wx.showToast({
// 													title: '导出通用名片成功',
// 													icon: 'success',
// 													duration: 1000
// 												})
// 											}
// 										}
// 									})
// 								}
// 							})
// 						}
// 					})
// 				} 
// 			}
// 		})
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
