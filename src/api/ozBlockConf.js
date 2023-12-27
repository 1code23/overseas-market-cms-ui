import request from "@/config/serve.js";

// api-整体配置列表
export function ozBlockList(data) {
  return request("post", "/ozBlock/list", data);
}
// 整体配置列表编辑
export function ozBlockUpdate(data) {
  return request("post", "/ozBlock/update", data);
}
// 国际化列表
export function ozBlockDescList(data) {
  return request("post", "/ozBlockDesc/list", data);
}
// 明细列表
export function queryozBlockConfList(data) {
  return request("post", "/ozBlockConf/list", data);
}
// 页面配置详情
export function getPageConfigDetail(params) {
  return request("get", "/ozBlockConfDetail/pageConfigDetail", params);
}
// 保存配置
export function savePageConfig(data) {
  return request("post", "/ozBlockConfDetail/detailAdd", data);
}
// 明细列表新增
export function ozBlockConfAdd(data) {
  return request("post", "/ozBlockConf/insert", data);
}
// 明细列表编辑
export function ozBlockConfEdit(data) {
  return request("post", "/ozBlockConf/update", data);
}
// 明细列表删除
export function ozBlockDelete(data) {
  return request("post", "/ozBlockConf/delete", data);
}
// 国际化列表删除
export function ozBlockConfDelete(data) {
  return request("post", "/ozBlockDesc/delete", data);
}
// 国际化列表新增
export function ozBlockConfInsert(data) {
  return request("post", "/ozBlockDesc/insert", data);
}
// 国际化列表修改
export function ozBlockConfUpdate(data) {
  return request("post", "/ozBlockDesc/update", data);
}
// 市场版本数据列表
export function getMarketList(params) {
  return request("post", "/market/manage/queryList", params, false);
}
