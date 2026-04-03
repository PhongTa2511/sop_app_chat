import request from "@/utils/request"

export function CreateDocumentFile(data) {
  return request({
    url: "DocumentFile/CreateDocumentFile",
    method: "post",
    data,
  })
}

export function UpdateDocumentFile(data) {
  return request({
    url: "DocumentFile/UpdateDocumentFile",
    method: "post",
    data,
  })
}
export function DelDocumentFile(data) {
  return request({
    url: "DocumentFile/DelDocumentFile",
    method: "post",
    data,
  })
}
export function GetDocumentFile(data) {
  return request({
    url: "DocumentFile/GetDocumentFile",
    method: "post",
    data,
  })
}
export function GetStepFileByMine(data) {
  return request({
    url: "DocumentFile/GetStepFileByMine",
    method: "post",
    data,
  })
}
