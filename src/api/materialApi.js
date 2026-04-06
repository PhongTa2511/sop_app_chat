import request from "@/utils/request";

export function GetMaterialLst(data) {
  return request({
    url: "RDMaterial/GetMaterialLst",
    method: "post",
    data,
  });
}

export function UpdateMaterialLst(data) {
  return request({
    url: "RDMaterial/UpdateMaterialLst",
    method: "post",
    data,
  });
}
