import request from "@/utils/request";

export function GetProductLst(data) {
  return request({
    url: "Product/GetProductLst",
    method: "post",
    data,
  });
}

export function CreateProduct(data) {
  return request({
    url: "Product/CreateProduct",
    method: "post",
    data,
  });
}
export function UpdateProduct(data) {
  return request({
    url: "Product/UpdateProduct",
    method: "post",
    data,
  });
}
export function DelProduct(data) {
  return request({
    url: "Product/DelProduct",
    method: "post",
    data,
  });
}
