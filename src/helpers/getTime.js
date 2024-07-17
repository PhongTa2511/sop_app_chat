import moment from "moment";
export function getTimeYesterday() {
  return moment(new Date()).format("yyyy-MM-DD 06:00:00");
}
export function getTimeLastDay() {
  return moment(new Date()).format("yyyy-MM-DD 23:59:00");
}
export function getTimeDayBefore() {
  const currentTime = new Date().setDate(new Date().getDate() - 1);
  return moment(currentTime).format("yyyy-MM-DD 00:00:00");
}
export function getDateCurrent() {
  const timeCurrent = new Date();
  return moment(timeCurrent).format("yyyy-MM-DD HH:mm:ss");
}

export function formatDate(date) {
  if (date) {
    return moment(date).format("yyyy-MM-DD HH:mm:ss");
  } else {
    return date;
  }
}
export function formatDateDDMM(date) {
  if (date) {
    return moment(date).format("DD/MM");
  } else {
    return date;
  }
}
export function formatDateHHMM(date) {
  if (date) {
    return moment(date).format("HH:mm");
  } else {
    return date;
  }
}
export function formatDateDisplay(date) {
  if (date) {
    return moment(date).format("HH:mm DD/MM/YYYY");
  } else {
    return date;
  }
}
export function formatDateUpload(date) {
  if (date) {
    return moment(date).format("YYYY-MM-DD");
  } else {
    return date;
  }
}
export function formatDateDisplayDDMMYY(date) {
  if (date) {
    return moment(date).format("DD/MM/YYYY");
  } else {
    return date;
  }
}

export function formatDate2(date) {
  if (date) {
    return moment(date).format("HH:mm:ss  DD-MM-YYYY");
  } else {
    return date;
  }
}
