import request from "@/utils/request";

export function GetCompanyLst(data) {
  return request({
    url: "GSPCompany/GetCompanyLst",
    method: "post",
    data,
  });
}
export function DelCompanyCustomer(data) {
  return request({
    url: "GSPCompany/DelCompanyCustomer",
    method: "post",
    data,
  });
}
export function UpdateCompanyInfo(data) {
  return request({
    url: "GSPCompany/UpdateCompanyInfo",
    method: "post",
    data,
  });
}
export function UpdateCompanyLst(data) {
  return request({
    url: "GSPCompany/UpdateCompanyLst",
    method: "post",
    data,
  });
}
export function GetCompanyInfoByID(data) {
  return request({
    url: "GSPCompany/GetCompanyInfoByID",
    method: "post",
    data,
  });
}

export function GetCountryLstByUserID(data) {
  return request({
    url: "GSPCompany/GetCountryLstByUserID",
    method: "post",
    data,
  });
}

export function GetCountryRoleLst(data) {
  return request({
    url: "GSPCompany/GetCountryRoleLst",
    method: "post",
    data,
  });
}
export function UpdateCountryRole(data) {
  return request({
    url: "GSPCompany/UpdateCountryRole",
    method: "post",
    data,
  });
}
export function GetCompanyGreenLst(data) {
  return request({
    url: "GSPCompany/GetCompanyGreenLst",
    method: "post",
    data,
  });
}
export function UpdateCompanyGreen(data) {
  return request({
    url: "GSPCompany/UpdateCompanyGreen",
    method: "post",
    data,
  });
}
export function ApproveCompanyGreen(data) {
  return request({
    url: "GSPCompany/ApproveCompanyGreen",
    method: "post",
    data,
  });
}
export function DelCompanyInfo(data) {
  return request({
    url: "GSPCompany/DelCompanyInfo",
    method: "post",
    data,
  });
}
