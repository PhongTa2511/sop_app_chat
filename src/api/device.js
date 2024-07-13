import request from "./request.js";

export function CreateDevice(data) {
  return request({
    url: "Device/CreateDevice",
    method: "post",
    data: data,
  });
}
export function UpdateDevice(data) {
  return request({
    url: "Device/UpdateDevice",
    method: "post",
    data: data,
  });
}
export function DelDevice(data) {
  return request({
    url: "Device/DelDevice",
    method: "post",
    data: data,
  });
}
export function GetDeviceLstByLabID(data) {
  return request({
    url: "Device/GetDeviceLstByLabID",
    method: "post",
    data: data,
  });
}
