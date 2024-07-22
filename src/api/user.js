import request from "./request.js";

export function UserLogin(data) {
  return request({
    url: "User/UserLogin",
    method: "post",
    data: data,
  });
}
export function LostPassword(data) {
  return request({
    url: "User/LostPassword",
    method: "post",
    data: data,
  });
}
export function UserRegister(data) {
  return request({
    url: "User/UserRegister",
    method: "post",
    data: data,
  });
}
export function GetOTPCheck(data) {
  return request({
    url: "User/GetOTPCheck",
    method: "post",
    data: data,
  });
}
export function ChangePassword(data) {
  return request({
    url: "User/ChangePassword",
    method: "post",
    data: data,
  });
}

export function GetUserInfo(data) {
  return request({
    url: "User/GetUserInfo",
    method: "post",
    data: data,
  });
}

export function UpdateUserInfo(data) {
  return request({
    url: "User/UpdateUserInfo",
    method: "post",
    data: data,
  });
}

export function GetEmployeeLst(data) {
  return request({
    url: "User/GetEmployeeLst",
    method: "post",
    data: data,
  });
}

export function AddEmployeeLst(data) {
  return request({
    url: "User/AddEmployeeLst",
    method: "post",
    data: data,
  });
}
