import {
  get,
  post,
  posts,
  postChat,
  open,
  put,
  deletes
} from './http'


//查询维修厂
const getWxc = function (parmas) {
  return get("/vehicle/org/employee/findByPhone", parmas)
}

//切换维修厂
const tabUser = function (parmas, headers) {
  return post("/vehicle/org/employee/changeGarage", parmas, headers)
}

//登出
const login = function (parmas) {
  return post("/vehicle/login", parmas)
}

//查询订单
const getBusiness = function (parmas) {
  return get("/vehicle/garage/queryGaragePageList", parmas)
}

//维修厂审核
const auditGarage = function (parmas) {
  return posts("/vehicle/garage/auditGarage", parmas)
}

//维修厂密码重置
const resetPassword = function (parmas) {
  return get("/vehicle/garage/resetPassword", parmas)
}

//查询汽车品牌
const getbrandList = function (parmas) {
  return get("/vehicle/config/brand/list", parmas)
}

//查询汽车型号
const findCarDataList = function (parmas) {
  return get("/vehicle/config/brand/carSeries/findCarDataList", parmas)
}

//查询汽车型号
const carSeriesFindList = function (parmas) {
  return get("/vehicle/config/brand/carSeries/findList", parmas)
}

//查询供应商
const querySupplierList = function (parmas) {
  return get("/vehicle/system/supplier/pageList", parmas)
}

//供应商审核
const supplierAudit = function (parmas) {
  return posts("/vehicle/system/supplier/audit", parmas)
}

//修改供应商
const supplierUpdate = function (parmas) {
  return posts("/vehicle/system/supplier/update", parmas)
}

//供应商密码重置
const supplierResetPassword = function (parmas) {
  return get("/vehicle/system/supplier/resetPassword", parmas)
}

//查询维修连锁店
const queryAllGarageList = function (parmas) {
  return get("/vehicle/garage/queryAllGarageList", parmas)
}

//查询维修厂
const queryGarageListByLevel = function (parmas) {
  return get("/vehicle/garage/queryGarageListByLevel", parmas)
}

//添加上级维修厂集团
const addSuperGarage = function (parmas) {
  return posts("/vehicle/garage/addSuperGarage", parmas)
}

//设置上级维修厂
const setSuperGarage = function (parmas) {
  return posts("/vehicle/garage/setSuperGarage", parmas)
}

//删除上级维修厂
const deleteSuperGarage = function (parmas) {
  return deletes(`/vehicle/garage/deleteSuperGarage?gid=${parmas.gid}`)
}

//查询所有配件
const getPart = function (parmas) {
  return get("/vehicle/part/page", parmas)
}
//新增配件
const addPart = function (parmas) {
  return posts("/vehicle/part/save", parmas)
}
//查询所有（平台）配件
const getPartList = function (parmas) {
  return get("/vehicle/part/page", parmas)
}
//删除配件
const deletePart = function (parmas) {
  return deletes("/vehicle/part/delete", parmas)
}

//获取活动列表 type (1有效，2所有)
const getActivityList = function (parmas) {
  return get("/vehicle/activity/getActivityList", parmas)
}
//创建活动
const createActivity = function (parmas) {
  return posts("/vehicle/activity/createActivity", parmas)
}
//删除活动
const deleteActivity = function (parmas) {
  return deletes("/vehicle/activity/deleteActivity", parmas)
}
//更新活动上下架
const updateActivityStatus = function (parmas) {
  return post("/vehicle/activity/updateActivityStatus", parmas)
}

//添加活动关联商品
const addActivityPart = function (parmas) {
  return posts("/vehicle/activity/addActivityPart", parmas)
}

//获取活动关联商品
const getActivityPartDetail = function (parmas) {
  return get("/vehicle/activity/getActivityPartDetail", parmas)
}

//删除活动关联商品
const deleteActivityPart = function (parmas) {
  return deletes("/vehicle/activity/deleteActivityPart", parmas)
}

//维修厂二维码设置
const updateQrCode = function (parmas) {
  return posts("/vehicle/garage/updateQrCode", parmas)
}

//获取活动统计
const getActivitySummery = function (parmas) {
  return posts("/vehicle/activity/getActivitySummery", parmas)
}

//获取优惠活动使用明细数据
const getActivityRecordListByGarage = function (parmas) {
  return posts("/vehicle/activity/getActivityRecordListByGarage", parmas)
}
//获取业务员
const salesmanList = function (parmas) {
  return get("/vehicle/org/employee/salesmanList", parmas)
}

//修改维修厂信息
const changeGarageInfo = function (parmas) {
  return posts("/vehicle/garage/changeGarageInfo", parmas)
}


// ----------11客服1--------------
// 左侧列表
const chat_left_list = function(parmas) {
	return postChat("/index/index", parmas)
}
//获取聊天历史
const getTalkHistory = function(parmas) {
	return postChat("/index/index/getTalkHistory", parmas)
}

//保存聊天历史
const saveSingleTalk = function(parmas) {
	return postChat("/index/index/saveSingleTalk", parmas)
}
// 根据电话号码查询用户id
const getUserInfo = function(parmas) {
	return postChat("/index/login/getUserInfo", parmas)
}

//创建聊天室

const startToSingleTalk = function(parmas) {
	return postChat("/index/index/startToSingleTalk", parmas)
}

//清除已读

const clearUnread = function(parmas) {
	return postChat("/index/index/clearUnread", parmas)
}

//上传

const upload = function(parmas) {
	return postChat("/index/index/upload", parmas)
}



export {
  getWxc,
  tabUser,
  login,
  getBusiness,
  auditGarage,
  resetPassword,
  getbrandList,
  carSeriesFindList,
  findCarDataList,
  querySupplierList,
  supplierAudit,
  supplierUpdate,
  supplierResetPassword,
  queryAllGarageList,
  queryGarageListByLevel,
  addSuperGarage,
  setSuperGarage,
  deleteSuperGarage,
  getPart,
  addPart,
  getPartList,
  deletePart,
  getActivityList,
  createActivity,
  deleteActivity,
  updateActivityStatus,
  addActivityPart,
  getActivityPartDetail,
  deleteActivityPart,
  updateQrCode,
  getActivitySummery,
  getActivityRecordListByGarage,
  salesmanList,
  changeGarageInfo,
  chat_left_list,
	saveSingleTalk,
	getTalkHistory,
	getUserInfo,
	startToSingleTalk,
	clearUnread,
	upload
}
