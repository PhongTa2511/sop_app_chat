import request from "@/utils/request";

export function GetRecurringJobLst(data) {
  return request({
    url: "Recurring/GetRecurringJobLst",
    method: "post",
    data,
  });
}

export function UpdateRecurringJobInfo(data) {
  return request({
    url: "Recurring/UpdateRecurringJobInfo",
    method: "post",
    data,
  });
}

export function UpdateRecurringJobStatus(data) {
  return request({
    url: "Recurring/UpdateRecurringJobStatus",
    method: "post",
    data,
  });
}

export function GetRecurringTaskLst(data) {
  return request({
    url: "Recurring/GetRecurringTaskLst",
    method: "post",
    data,
  });
}

export function ReportRecurringJobInfo(data) {
  return request({
    url: "Recurring/ReportRecurringJobInfo",
    method: "post",
    data,
  });
}

export function ApproveRecurringJobInfo(data) {
  return request({
    url: "Recurring/ApproveRecurringJobInfo",
    method: "post",
    data,
  });
}

export function GetProgressByRecID(data) {
  return request({
    url: "Recurring/GetProgressByRecID",
    method: "post",
    data,
  });
}

export function GetRecurringTaskByID(data) {
  return request({
    url: "Recurring/GetRecurringTaskByID",
    method: "post",
    data,
  });
}
