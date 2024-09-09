import request from "@/api/request";

export function GetDefaultValue(data) {
  return request({
    url: "Other/GetDefaultValue",
    method: "post",
    data: data,
  });
}

export function CreateDefaultValue(data) {
  return request({
    url: "Other/CreateDefaultValue",
    method: "post",
    data: data,
  });
}

export function UpdateDefaultValue(data) {
  return request({
    url: "Other/UpdateDefaultValue",
    method: "post",
    data: data,
  });
}

export function DelDefaultValue(data) {
  return request({
    url: "Other/DelDefaultValue",
    method: "post",
    data: data,
  });
}
