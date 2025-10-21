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
export function GetDocumentInfoByID(data) {
  return request({
    url: "GSPDocument/GetDocumentInfoByID",
    method: "post",
    data,
  });
}

export function GetDocumentByProID(data) {
  return request({
    url: "GSPDocument/GetDocumentByProID",
    method: "post",
    data,
  });
}
export function UpdateDocumentAssign(data) {
  return request({
    url: "GSPDocument/UpdateDocumentAssign",
    method: "post",
    data,
  });
}

export function GetDocumentQT00003Lst(data) {
  return request({
    url: "GSPDocument/GetDocumentQT00003Lst",
    method: "post",
    data,
  });
}
