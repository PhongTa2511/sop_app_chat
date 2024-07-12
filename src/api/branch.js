import request from "./request.js";

export function UpdateBranch(data) {
  return request({
    url: "Branch/UpdateBranch",
    method: "post",
    data: data,
  });
}

export function GetBranchLst(data) {
  return request({
    url: "Branch/GetBranchLst",
    method: "post",
    data: data,
  });
}

export function UpdateBranchLab(data) {
  return request({
    url: "Branch/UpdateBranchLab",
    method: "post",
    data: data,
  });
}

export function GetLabLstByBranch(data) {
  return request({
    url: "Branch/GetLabLstByBranch",
    method: "post",
    data: data,
  });
}
