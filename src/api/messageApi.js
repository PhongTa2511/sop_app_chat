import request from "@/utils/requestMessage";

export function GetMessageByGoupID(data) {
  return request({
    url: "messages/group",
    method: "post",
    data,
  });
}

export function GetGroupMessageLst(data) {
  return request({
    url: "groups/getLst",
    method: "post",
    data,
  });
}

export function SendMessage(data) {
  return request({
    url: "messages/send",
    method: "post",
    data,
  });
}
