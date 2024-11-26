import { getToken, getUserName } from "@/utils/auth";
import request from "@/utils/requestMessage";
export function GetMessageByGoupID(data) {
  return request({
    url: "messages/GetMessageByGroupID",
    method: "post",
    data,
  });
}

export function GetGroupLstByUserID(data) {
  return request({
    url: "groups/GetGroupLstByUserID",
    method: "post",
    data,
  });
}

export function CreateGroup(data) {
  return request({
    url: "groups/CreateGroup",
    method: "post",
    data,
  });
}

export function UpdateGroup(data) {
  return request({
    url: "groups/UpdateGroup",
    method: "post",
    data,
  });
}

export function AddMemberGroup(data) {
  return request({
    url: "groups/AddMemberGroup",
    method: "post",
    data,
  });
}

export function DelMemberGroup(data) {
  return request({
    url: "groups/DelMemberGroup",
    method: "post",
    data,
  });
}

export function SendMessageChat(data) {
  return request({
    url: "messages/SendMessageChat",
    method: "post",
    data,
  });
}

export function GetMemberLstByGroupID(data) {
  return request({
    url: "groups/GetMemberLstByGroupID",
    method: "post",
    data,
  });
}

export function urlUploadImageGroup(ID) {
  return `http://202.191.56.172/GSPDTPAPI/File/UploadAvatarGroup?UserName=${getUserName()}&Token=${getToken()}&GroupID=${ID}`;
}
export function urlUploadMessageFile(ID) {
  return `http://202.191.56.172/GSPDTPAPI/File/UploadMessageFile?UserName=${getUserName()}&Token=${getToken()}&MessageID=${ID}`;
}
