import request from "@/utils/request";

export function CreateProcedure(data) {
  return request({
    url: "Procedure/CreateProcedure",
    method: "post",
    data,
  });
}
export function UpdateProcedure(data) {
  return request({
    url: "Procedure/UpdateProcedure",
    method: "post",
    data,
  });
}
export function DelProcedure(data) {
  return request({
    url: "Procedure/DelProcedure",
    method: "post",
    data,
  });
}
export function GetProcedureLst(data) {
  return request({
    url: "Procedure/GetProcedureLst",
    method: "post",
    data,
  });
}
export function GetProcedureByID(data) {
  return request({
    url: "Procedure/GetProcedureByID",
    method: "post",
    data,
  });
}
export function UpdateProcedureNameInfo(data) {
  return request({
    url: "Procedure/UpdateProcedureNameInfo",
    method: "post",
    data,
  });
}

export function CreateStep(data) {
  return request({
    url: "Step/CreateStep",
    method: "post",
    data,
  });
}
export function UpdateStep(data) {
  return request({
    url: "Step/UpdateStep",
    method: "post",
    data,
  });
}
export function DelStep(data) {
  return request({
    url: "Step/DelStep",
    method: "post",
    data,
  });
}
export function GetStepLst(data) {
  return request({
    url: "Step/GetStepLst",
    method: "post",
    data,
  });
}
export function GetStepByID(data) {
  return request({
    url: "Step/GetStepByID",
    method: "post",
    data,
  });
}
export function GetStepByProcedure(data) {
  return request({
    url: "Step/GetStepByProcedure",
    method: "post",
    data,
  });
}

export function CreateWorkDefine(data) {
  return request({
    url: "WorkDefine/CreateWorkDefine",
    method: "post",
    data,
  });
}

export function UpdateWorkDefine(data) {
  return request({
    url: "WorkDefine/UpdateWorkDefine",
    method: "post",
    data,
  });
}

export function DelWorkDefine(data) {
  return request({
    url: "WorkDefine/DelWorkDefine",
    method: "post",
    data,
  });
}

export function GetWorkDefineLst(data) {
  return request({
    url: "WorkDefine/GetWorkDefineLst",
    method: "post",
    data,
  });
}

// Thêm đối tượng vào đầu việc

export function CreateUserApprove(data) {
  return request({
    url: "UserApprove/CreateUserApprove",
    method: "post",
    data,
  });
}
export function UpdateUserApprove(data) {
  return request({
    url: "UserApprove/UpdateUserApprove",
    method: "post",
    data,
  });
}
export function DelUserApprove(data) {
  return request({
    url: "UserApprove/DelUserApprove",
    method: "post",
    data,
  });
}
export function GetUserApproveByWork(data) {
  return request({
    url: "UserApprove/GetUserApproveByWork",
    method: "post",
    data,
  });
}
export function CreateForm(data) {
  return request({
    url: "Form/CreateForm",
    method: "post",
    data,
  });
}
export function UpdateForm(data) {
  return request({
    url: "Form/UpdateForm",
    method: "post",
    data,
  });
}
export function DelForm(data) {
  return request({
    url: "Form/DelForm",
    method: "post",
    data,
  });
}
export function GetFormLst(data) {
  return request({
    url: "Form/GetFormLst",
    method: "post",
    data,
  });
}
export function GetFormLstByID(data) {
  return request({
    url: "Form/GetFormLstByID",
    method: "post",
    data,
  });
}
export function GetFormByID(data) {
  return request({
    url: "Form/GetFormByID",
    method: "post",
    data,
  });
}
