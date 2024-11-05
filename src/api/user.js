import { getToken } from "@/utils/auth.js";

import request from "@/utils/request";
import requestC from "@/utils/request-cpc1hn";

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

export function Login(data) {
  return requestC({
    url: "User/Login",
    method: "post",
    data: data,
  });
}

export function GetUserLstAll(data) {
  return request({
    url: "User/GetUserLstAll",
    method: "post",
    data,
  });
}
export function SetUserRole(data) {
  return request({
    url: "User/SetUserRole",
    method: "post",
    data,
  });
}
export function DelUserRole(data) {
  return request({
    url: "User/DelUserRole",
    method: "post",
    data,
  });
}
export function GetUserRole(data) {
  return request({
    url: "User/GetUserRole",
    method: "post",
    data,
  });
}
export function RegisterAccount(data) {
  return request({
    url: "User/GSPRegister",
    method: "post",
    data,
  });
}

export function UpdateUserInfo(data) {
  return request({
    url: "User/UpdateUserInfo",
    method: "post",
    data,
  });
}

export function GetUserInfo(data) {
  return request({
    url: "User/GetUserInfo",
    method: "post",
    data,
  });
}

export function urlUploadImageAvatar(ID) {
  return `http://202.191.56.172/GSPDTPAPI/File/UploadAvatarUser?UserName=${ID}&Token=${getToken()}`;
}
