import request from "@/utils/request";

export function GetProductLst(data) {
  return request({
    url: "Product/GetProductLst",
    method: "post",
    data,
  });
}

export function CreateWareHouse(data) {
  return request({
    url: "WareHouse/CreateWareHouse",
    method: "post",
    data,
  });
}
export function UpdateWareHouse(data) {
  return request({
    url: "WareHouse/UpdateWareHouse",
    method: "post",
    data,
  });
}
export function DelWareHouse(data) {
  return request({
    url: "WareHouse/DelWareHouse",
    method: "post",
    data,
  });
}
export function GetWareHouseLst(data) {
  return request({
    url: "WareHouse/GetWareHouseLst",
    method: "post",
    data,
  });
}

export function GetWareHouseByCompany(data) {
  return request({
    url: "WareHouse/GetWareHouseByCompany",
    method: "post",
    data,
  });
}

export function GetWareHouseByID(data) {
  return request({
    url: "WareHouse/GetWareHouseByID",
    method: "post",
    data,
  });
}

export function GetWarehouseJobByID(data) {
  return request({
    url: "GSPWarehouseJob/GetWarehouseJobByID",
    method: "post",
    data,
  });
}
