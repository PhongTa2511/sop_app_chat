import { getToken, getUserName } from "@/utils/auth";

var token = getToken();
var username = getUserName();

export function urlUploadFileFormLine(idForm, documentid) {
  return `https://sop.idtp.work/api/File/UploadDocumentFormLine?UserName=${username}&Token=${token}&idForm=${idForm}&documentid=${documentid}`;
}

export function urlUploadFile(data) {
  return `https://sop.idtp.work/api/File/UploadDocumentFile?UserName=${username}&Token=${token}&RowID=${data}`;
}

export function urlUploadRecurringFile(data) {
  return `https://sop.idtp.work/api/File/UploadRecurringFile?UserName=${username}&Token=${token}&RowID=${data}`;
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map((v) =>
    filterVal.map((j) => {
      return v[j.key];
    }),
  );
}
export function formatHeader(headerData) {
  return headerData.map((v) => {
    return v.title;
  });
}

export function exportExcel(headers) {
  var dataLst = [];
  import("@/vendor/Export2Excel").then((excel) => {
    const data = formatJson(headers, dataLst);

    excel.export_json_to_excel({
      header: formatHeader(headers),
      data: data,
      filename: "Mẫu Excel hàng hóa",
      autoWidth: true,
      bookType: "xlsx",
    });
  });
}

export function excelDateToJSDate(serial) {
  var utc_days = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);
  var fractional_day = serial - Math.floor(serial) + 0.0000001;
  var total_seconds = Math.floor(86400 * fractional_day);
  var seconds = total_seconds % 60;
  total_seconds -= seconds;
  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds,
  );
}

export function convertToDate(dateString) {
  let [day, month, year] = dateString.split("/");
  let dateObject = new Date(year, month - 1, day);
  if (!isNaN(dateObject)) {
    return dateObject;
  } else {
    return null; // Trả về null nếu không phải ngày hợp lệ
  }
}
