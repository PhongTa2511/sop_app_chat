import request from "@/utils/request";

export function GetCallLocalLst(data) {
  return request({
    url: "Call/GetCallLocalLst",
    method: "post",
    data: data,
  });
}

export function GetCallDetailLstByPlaceID(data) {
  return request({
    url: "Call/GetCallDetailLstByPlaceID",
    method: "post",
    data: data,
  });
}

export function CreateCallDetail(data) {
  return request({
    url: "Call/CreateCallDetail",
    method: "post",
    data: data,
  });
}

export function CreateCallInfo(data) {
  return request({
    url: "Call/CreateCallInfo",
    method: "post",
    data: data,
  });
}
