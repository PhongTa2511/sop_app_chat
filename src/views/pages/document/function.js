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
var headers = [
  {
    title: "STT",
    sortable: false,
    key: "Key",
    width: 40,
    align: "center",
  },
  { title: "Tên hàng hóa", key: "ProductName", sortable: false },
  { title: "Số lô", key: "Lotcode", sortable: false },
  { title: "Mã BFO", key: "BFO", sortable: false, align: "center" },
  { title: "Hạn dùng", key: "ExpDate", sortable: false, align: "center" },
  {
    title: "Số lượng",
    key: "Quantity",
    sortable: false,
    align: "center",
  },
  {
    title: "ĐVT",
    key: "Unit",
    sortable: false,
    align: "center",
  },
  {
    title: "Tình trạng",
    key: "StatusText",
    sortable: false,
    align: "center",
  },
  {
    title: "Quyết định",
    key: "Decision",
    sortable: false,
    align: "center",
  },
  {
    title: "Ghi chú",
    key: "Note",
    sortable: false,
    align: "center",
  },
];

export function exportExcel() {
  var dataLst = [
    {
      Key: "1",
      ProductName: "Camphor (Camphor Powder Syn Bp)",
      Lotcode: "110932",
      BFO: "C02273",
      ExpDate: "09/01/2024",
      Quantity: "6200.1",
      Unit: "Gam ",
      StatusText: "NL hết hạn ",
      Decision: "",
      Note: "",
    },
    {
      Key: "2",
      ProductName: "Plantaginis Extract (cao khô mã đề)",
      Lotcode: "210925",
      BFO: "C02537",
      ExpDate: "24/09/2024",
      Quantity: "2000",
      Unit: "Gam ",
      StatusText: "NL cận hạn ",
      Decision: "",
      Note: "",
    },
    {
      Key: "3",
      ProductName: "Asparagi Cochinchinensis Extract (Cao khô thiên môn đông)",
      Lotcode: "210924",
      BFO: "A01682",
      ExpDate: "23/09/2024",
      Quantity: "560",
      Unit: "Gam ",
      StatusText: "NL cận hạn ",
      Decision: "",
      Note: "",
    },
    {
      Key: "4",
      ProductName: "Menthol crystal (L-menthol)",
      Lotcode: "20210928",
      BFO: "M00003",
      ExpDate: "27/09/2024",
      Quantity: "14,993,941",
      Unit: "Gam ",
      StatusText: "NL cận hạn ",
      Decision: "",
      Note: "",
    },
  ];
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
    seconds
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
