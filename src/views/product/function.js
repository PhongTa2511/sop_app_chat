import { getToken, getUserName } from "@/utils/auth";

var token = getToken();
var username = getUserName();

export function urlUploadFile(data) {
  return `https://rd.icpc1hn.work/api/File/UploadProductFile?UserName=${username}&Token=${token}&ProductID=${data}`;
}
