import { getToken, getUserName } from "@/utils/auth";

var token = getToken();
var username = getUserName();

export function urlUploadFile(data) {
  return `http://202.191.56.172/GSPDTPAPI/File/UploadDocumentFile?UserName=${username}&Token=${token}&RowID=${data}`;
}
