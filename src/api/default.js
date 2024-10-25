import request from "@/utils/request";


export function CreateDefaultValue(data) {
  return request({
    url: "Other/CreateDefaultValue",
    method: "post",
    data,
  });
}
export function GetCity(data) {
  return request({
    url: "Other/GetCity",
    method: "post",
    data,
  });
}
export function GetDistrict(data) {
  return request({
    url: "Other/GetDistrict",
    method: "post",
    data,
  });
}
export function GetCommune(data) {
  return request({
    url: "Other/GetCommune",
    method: "post",
    data,
  });
}
export function GetDefaultValue(data) {
  return request({
    url: "Other/GetDefaultValue",
    method: "post",
    data,
  });
}
export function UpdateDefaultValue(data) {
  return request({
    url: "Other/UpdateDefaultValue",
    method: "post",
    data,
  });
}
export function DelDefaultValue(data) {
  return request({
    url: "Other/DelDefaultValue",
    method: "post",
    data,
  });
}
