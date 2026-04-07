import request from "@/utils/request"

export function GetCountryLawLst(data) {
  return request({
    url: "RDCountry/GetCountryLawLst",
    method: "post",
    data,
  })
}

export function GetCountryLstNumber(data) {
  return request({
    url: "RDCountry/GetCountryLstNumber",
    method: "post",
    data,
  })
}

export function UpdateCountryLawLst(data) {
  return request({
    url: "RDCountry/UpdateCountryLawLst",
    method: "post",
    data,
  })
}
