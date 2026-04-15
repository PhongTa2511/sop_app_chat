import { getToken, getUserName } from "@/utils/auth"
import request from "@/utils/requestMessage"

export function GetMessageByGoupID(data) {
  return request({
    url: "messages/GetMessageByGroupID",
    method: "post",
    data,
  })
}

export function GetGroupLstByUserID(data) {
  return request({
    url: "groups/GetGroupLstByUserID",
    method: "post",
    data,
  })
}

export function CreateGroup(data) {
  return request({
    url: "groups/CreateGroup",
    method: "post",
    data,
  })
}

export function UpdateGroup(data) {
  return request({
    url: "groups/UpdateGroup",
    method: "post",
    data,
  })
}

export function AddMemberGroup(data) {
  return request({
    url: "groups/AddMemberGroup",
    method: "post",
    data,
  })
}

export function DelMemberGroup(data) {
  return request({
    url: "groups/DelMemberGroup",
    method: "post",
    data,
  })
}

export function LeaveGroup(data) {
  return request({
    url: "groups/LeaveGroup",
    method: "post",
    data,
  })
}

export function DeleteGroup(data) {
  return request({
    url: "groups/DeleteGroup",
    method: "post",
    data,
  })
}

export function SendMessage(data) {
  return request({
    url: "messages/SendMessage",
    method: "post",
    data,
  })
}

export function ReadMessage(data) {
  return request({
    url: "messages/ReadMessage",
    method: "post",
    data,
  })
}

export function GetMemberLstByGroupID(data) {
  return request({
    url: "groups/GetMemberLstByGroupID",
    method: "post",
    data,
  })
}

export function GetReactionsByMessageIDs(data) {
  return request({
    url: "messages/GetReactionsByMessageIDs",
    method: "post",
    data,
  })
}

export function ReactMessage(data) {
  return request({
    url: "messages/ReactMessage",
    method: "post",
    data,
  })
}

export function PinMessage(data) {
  return request({
    url: "messages/PinMessage",
    method: "post",
    data,
  })
}

export function GetPinnedMessages(data) {
  return request({
    url: "messages/GetPinnedMessages",
    method: "post",
    data,
  })
}

export function urlUploadImageGroup(ID) {
  return `https://sop.idtp.work/api/File/UploadAvatarGroup?UserName=${getUserName()}&Token=${getToken()}&GroupID=${ID}`
}
export function urlUploadMessageFile(ID) {
  return `https://sop.idtp.work/api/File/UploadMessageFile?UserName=${getUserName()}&Token=${getToken()}&MessageID=${ID}`
}
