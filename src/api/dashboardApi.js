import request from "@/utils/request"

export function GetDashboard(data) {
  return request({
    url: "Dashboard/GetDashboard",
    method: "post",
    data,
  })
}
