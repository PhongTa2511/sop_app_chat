import request from "@/utils/request";

export function GetOrganizationLst(data) {
  return request({
    url: "Organization/GetOrganizationLst",
    method: "post",
    data,
  });
}
export function AddOrganizationInfo(data) {
  return request({
    url: "Organization/AddOrganizationInfo",
    method: "post",
    data,
  });
}
export function UpdateOrganizationInfo(data) {
  return request({
    url: "Organization/UpdateOrganizationInfo",
    method: "post",
    data,
  });
}
export function GetOrganizationLstByUser(data) {
  return request({
    url: "Organization/GetOrganizationLstByUser",
    method: "post",
    data,
  });
}
