import request from "@/utils/request";

export function CreateGSPDocument(data) {
  return request({
    url: "GSPDocument/CreateGSPDocument",
    method: "post",
    data,
  });
}

export function UpdateGSPDocument(data) {
  return request({
    url: "GSPDocument/UpdateGSPDocument",
    method: "post",
    data,
  });
}
export function DelGSPDocument(data) {
  return request({
    url: "GSPDocument/DelGSPDocument",
    method: "post",
    data,
  });
}
export function GetGSPDocumentLst(data) {
  return request({
    url: "GSPDocument/GetGSPDocumentLst",
    method: "post",
    data,
  });
}
export function GSPGetGSPDocumentInfoByID(data) {
  return request({
    url: "GSPDocument/GSPGetGSPDocumentInfoByID",
    method: "post",
    data,
  });
}


export function GetGSPDocumentByStoreID(data) {
  return request({
    url: "GSPDocument/GetGSPDocumentByStoreID",
    method: "post",
    data,
  });
}
  