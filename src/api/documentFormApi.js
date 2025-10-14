import request from "@/utils/request";

export function UpdateDocumentForm(data) {
  return request({
    url: "GSPDocumentForm/UpdateDocumentForm",
    method: "post",
    data,
  });
}

export function GetDocumentFormByDocID(data) {
  return request({
    url: "GSPDocumentForm/GetDocumentFormByDocID",
    method: "post",
    data,
  });
}

export function GetDocumentFormByID(data) {
  return request({
    url: "GSPDocumentForm/GetDocumentFormByID",
    method: "post",
    data,
  });
}

export function GetDocumentFormByProductID(data) {
  return request({
    url: "GSPDocumentForm/GetDocumentFormByProductID",
    method: "post",
    data,
  });
}

export function UpdateDocumentFormPublic(data) {
  return request({
    url: "GSPDocumentForm/UpdateDocumentFormPublic",
    method: "post",
    data,
  });
}

export function GetDocumentFormLstPublic(data) {
  return request({
    url: "GSPDocumentForm/GetDocumentFormLstPublic",
    method: "post",
    data,
  });
}
