import request from "@/api/request";

export function GetAttendanceLstByTime(data) {
  return request({
    url: "Attendance/GetAttendanceLstByTime",
    method: "post",
    data: data,
  });
}
