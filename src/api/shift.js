import request from "@/api/request";

export function UpdateShiftLst(data) {
  return request({
    url: "Shift/UpdateShiftLst",
    method: "post",
    data: data,
  });
}

export function GetShiftLst(data) {
  return request({
    url: "Shift/GetShiftLst",
    method: "post",
    data: data,
  });
}
