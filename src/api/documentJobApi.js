import request from "@/utils/request";

export function UpdateDocumentJob(data) {
  return request({
    url: "GSPDocumentJob/UpdateDocumentJob",
    method: "post",
    data,
  });
}
export function GetDocumentJobByDocID(data) {
  return request({
    url: "GSPDocumentJob/GetDocumentJobByDocID",
    method: "post",
    data,
  });
}

export function GetDocumentJobInfo(data) {
  return request({
    url: "GSPDocumentJob/GetDocumentJobInfo",
    method: "post",
    data,
  });
}

export function AddAssignLst(data) {
  return request({
    url: "GSPDocumentJob/AddAssignLst",
    method: "post",
    data,
  });
}

export function SendMailAddAssignLst(data) {
  return request({
    url: "GSPDocumentJob/SendMailAddAssignLst",
    method: "post",
    data,
  });
}

export function GetDocumentJobByEm(data) {
  return request({
    url: "GSPDocumentJob/GetDocumentJobByEm",
    method: "post",
    data,
  });
}

export function ReportDocumentJob(data) {
  return request({
    url: "GSPDocumentJob/ReportDocumentJob",
    method: "post",
    data,
  });
}

export function ApproveDocumentJob(data) {
  return request({
    url: "GSPDocumentJob/ApproveDocumentJob",
    method: "post",
    data,
  });
}

export function ProcessDocument(data) {
  return request({
    url: "GSPDocumentJob/GSPProcessDocument",
    method: "post",
    data,
  });
}

export function CancelDocumentJob(data) {
  return request({
    url: "GSPDocumentJob/CancelDocumentJob",
    method: "post",
    data,
  });
}

export function CancelDocument(data) {
  return request({
    url: "GSPDocumentJob/CancelDocumentJob",
    method: "post",
    data,
  });
}

export function StartDocument(data) {
  return request({
    url: "GSPDocumentJob/StartDocument",
    method: "post",
    data,
  });
}
