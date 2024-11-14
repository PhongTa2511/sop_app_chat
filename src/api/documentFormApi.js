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
