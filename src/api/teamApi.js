import request from "@/utils/request";

export function GetTeamLst(data) {
  return request({
    url: "Team/GetTeamLst",
    method: "post",
    data,
  });
}
export function AddTeamInfo(data) {
  return request({
    url: "Team/AddTeamInfo",
    method: "post",
    data,
  });
}
export function UpdateTeamInfo(data) {
  return request({
    url: "Team/UpdateTeamInfo",
    method: "post",
    data,
  });
}
