import request from "@/utils/request";

export function GetProductLst(data) {
  return request({
    url: "Product/GetProductLst",
    method: "post",
    data,
  });
}
