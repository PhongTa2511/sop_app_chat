export function formatJson(filterVal, jsonData) {
  return jsonData.map((v) =>
    filterVal.map((j) => {
      return v[j.key];
    })
  );
}
export function formatHeader(headerData) {
  return headerData.map((v) => {
    return v.title;
  });
}
export function exportExcel1(dataDoc, headers) {
  var data = [{ key: "Key" }];
  for (var i = 1; i <= headers.length; i++) {
    data.push({ key: "Line" + i });
  }
  // var headers = [
  //   { title: "Mã hồ sơ", key: "DocumentID", sortable: false, align: "center" },
  // ];
  import("@/vendor/Export2Excel").then((excel) => {
    const data1 = formatJson(data, dataDoc);
    excel.export_json_to_excel({
      header: formatHeader(headers),
      data: data1,
      filename: "Danh sách hồ sơ",
      autoWidth: true,
      bookType: "xlsx",
    });
  });
}
