export function formatJson(filterVal, jsonData) {
  return jsonData.map(v =>
    filterVal.map(j => {
      return v[j.key]
    }),
  )
}
export function formatHeader(headerData) {
  return headerData.map(v => {
    return v.title
  })
}
export function exportExcel(dataDoc) {
  var headers = [
    { title: "Mã hồ sơ", key: "DocumentID", sortable: false, align: "center" },
    { title: "Quy trình", key: "DocName", sortable: false, align: "center" },
    {
      title: "Mã sản phẩm",
      key: "ProductID",
      sortable: false,
      align: "center",
    },
    {
      title: "Tên sản phẩm",
      key: "ProductName",
      sortable: false,
      align: "center",
    },
    {
      title: "Tên xuất khẩu",
      key: "ProductExport",
      sortable: false,
      align: "center",
    },
    {
      title: "Loại sản phẩm",
      key: "ProductType",
      sortable: false,
      align: "center",
    },
    { title: "Nước XK", key: "Country", sortable: false, align: "center" },
    {
      title: "Công việc",
      key: "JobName",
      sortable: false,
      align: "center",
    },

    {
      title: "Tiếp nhận",
      key: "DateRecept",
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
      title: "Đã làm (ngày)",
      key: "DaysWorked",
      sortable: false,
      align: "center",
    },
    {
      title: "Quá hạn (ngày)",
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
  ]
  import("@/vendor/Export2Excel").then(excel => {
    const data = formatJson(headers, dataDoc)

    excel.export_json_to_excel({
      header: formatHeader(headers),
      data: data,
      filename: "Danh sách hồ sơ Order chất chuẩn",
      autoWidth: true,
      bookType: "xlsx",
    })
  })
}
