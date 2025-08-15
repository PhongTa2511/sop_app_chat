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
export function exportExcel(dataDoc) {
  var headers = [
    { title: "Mã hồ sơ", key: "DocumentID", sortable: false, align: "center" },
    { title: "DocName", key: "DocName", sortable: false, align: "center" },
    {
      title: "Mã sản phẩm",
      key: "WarehouseID",
      sortable: false,
      align: "center",
    },
    {
      title: "Tên sản phẩm",
      key: "WarehouseName",
      sortable: false,
      align: "center",
    },
    {
      title: "Tên xuất khẩu",
      key: "Name2",
      sortable: false,
      align: "center",
    },

    { title: "Khách", key: "CusName", sortable: false, align: "center" },

    {
      title: "Phân loại",
      key: "StoreType",
      sortable: false,
      align: "center",
    },
    {
      title: "Quy cách",
      key: "Package",
      sortable: false,
      align: "center",
    },
    {
      title: "Ngày tạo",
      key: "TimeCreate",
      sortable: false,
      align: "center",
    },
    {
      title: "Deadline",
      key: "DateExpired",
      sortable: false,
      align: "center",
    },
    {
      title: "Ngày làm việc",
      key: "DaysWorked",
      sortable: false,
      align: "center",
    },
    {
      title: "Quá hạn",
      key: "DaysRemaining",
      sortable: false,
      align: "center",
    },
    {
      title: "Trạng thái",
      key: "StatusShow",
      sortable: false,
      align: "center",
    },
    {
      title: "Nhân viên",
      key: "EmployeeName",
      sortable: false,
      align: "center",
    },
    {
      title: "Barcode",
      key: "Barcode",
      sortable: false,
      align: "center",
    },
    {
      title: "Design",
      key: "Design",
      sortable: false,
      align: "center",
    },
    {
      title: "Quy trình",
      key: "StepID",
      sortable: false,
      align: "center",
    },
    {
      title: "Phân loại hồ sơ",
      key: "Conclusion",
      sortable: false,
      align: "center",
    },
  ];
  import("@/vendor/Export2Excel").then((excel) => {
    const data = formatJson(headers, dataDoc);
    excel.export_json_to_excel({
      header: formatHeader(headers),
      data: data,
      filename: "Danh sách hồ sơ Nhãn trong nước",
      autoWidth: true,
      bookType: "xlsx",
    });
  });
}
