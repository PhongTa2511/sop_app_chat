import request from "@/utils/request";

export function GetCompanyLst(data) {
  return request({
    url: "GSPCompany/GetCompanyLst",
    method: "post",
    data,
  });
}
