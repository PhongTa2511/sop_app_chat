import request from "@/utils/request";

export function GetStepArisingLstByDoc(data) {
  return request({
    url: "GSPDocumentStep/GetStepArisingLstByDoc",
    method: "post",
    data,
  });
}

export function UpdateStepArising(data) {
  return request({
    url: "GSPDocumentStep/UpdateStepArising",
    method: "post",
    data,
  });
}

export function UpdateStepStatus(data) {
  return request({
    url: "GSPDocumentStep/UpdateStepStatus",
    method: "post",
    data,
  });
}

export function StartStepArising(data) {
  return request({
    url: "GSPDocumentStep/StartStepArising",
    method: "post",
    data,
  });
}
