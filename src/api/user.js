import request from "./request.js";

export function UserLogin(data) {
  return request({
    url: "User/UserLogin",
    method: "post",
    data: data,
  });
}
