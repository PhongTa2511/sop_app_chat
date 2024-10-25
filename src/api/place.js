import request from "@/utils/request";

export function UpdatePlaceGroupInfo(data) {
  return request({
    url: "Place/UpdatePlaceGroupInfo",
    method: "post",
    data: data,
  });
}



export function UpdateStatusBox(data) {
  return request({
    url: "Ship/UpdateStatusBox",
    method: "post",
    data: data,
  });
}