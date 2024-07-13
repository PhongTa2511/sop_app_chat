import request from "./request.js";

export function AddUserLab(data) {
  return request({
    url: "Lab/AddUserLab",
    method: "post",
    data: data,
  });
}

export function GetUserLabLst(data) {
  return request({
    url: "Lab/GetUserLabLst",
    method: "post",
    data: data,
  });
}
