import request from "@/api/request";

export function UpdateScheduleLst(data) {
  return request({
    url: "Schedule/UpdateScheduleLst",
    method: "post",
    data: data,
  });
}

export function GetScheduleLst(data) {
  return request({
    url: "Schedule/GetScheduleLst",
    method: "post",
    data: data,
  });
}
