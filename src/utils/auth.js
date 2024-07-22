import Cookies from "js-cookie";

const TokenKey = "TokenILAB";
const UserName = "UserNameILAB";
const FullName = "FullNameILAB";
const PhoneNumber = "PhoneNumberILAB";

const TypeCare = "TypeCareILAB";
const EmployCode = "CommuneILAB";
const UserID = "UserIDILAB";
const Email = "EmailILAB";
const PageNumber = "PageNumberILAB";
const RowspPage = "RowspPageILAB";
const Avatar = "AvatarILAB";
const RankCustomer = "RankCustomerILAB";

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 });
}
export function getToken() {
  return Cookies.get(TokenKey);
}
export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function setUserName(name) {
  return Cookies.set(UserName, name);
}
export function removeUserName() {
  return Cookies.remove(UserName);
}
export function getUserName() {
  return Cookies.get(UserName);
}

export function setFullName(time) {
  return Cookies.set(FullName, time);
}
export function getFullName() {
  return Cookies.get(FullName);
}
export function removeFullName() {
  return Cookies.remove(FullName);
}

export function setPhoneNumber(phoneNumber) {
  return Cookies.set(PhoneNumber, phoneNumber);
}
export function getPhoneNumber() {
  return Cookies.get(PhoneNumber);
}
export function removePhoneNumber() {
  return Cookies.remove(PhoneNumber);
}

export function setEmployCode(name) {
  return Cookies.set(EmployCode, name);
}
export function getEmployCode() {
  return Cookies.get(EmployCode);
}
export function removeEmployCode() {
  return Cookies.remove(EmployCode);
}

export function setUserID(name) {
  return Cookies.set(UserID, name);
}
export function getUserID() {
  return Cookies.get(UserID);
}
export function removeUserID() {
  return Cookies.remove(UserID);
}

export function setEmail(name) {
  return Cookies.set(Email, name);
}
export function getEmail() {
  return Cookies.get(Email);
}
export function removeEmail() {
  return Cookies.remove(Email);
}

export function setPageNumber(name) {
  return Cookies.set(PageNumber, name);
}
export function getPageNumber() {
  return Cookies.get(PageNumber);
}
export function removePageNumber() {
  return Cookies.remove(PageNumber);
}

export function setRowspPage(name) {
  return Cookies.set(RowspPage, name);
}
export function getRowspPage() {
  return Cookies.get(RowspPage);
}
export function removeRowspPage() {
  return Cookies.remove(RowspPage);
}

export function setAvatar(name) {
  return Cookies.set(Avatar, name);
}
export function getAvatar() {
  return Cookies.get(Avatar);
}
export function removeAvatar() {
  return Cookies.remove(Avatar);
}

export function setRankCustomer(name) {
  return Cookies.set(RankCustomer, name);
}
export function getRankCustomer() {
  return Cookies.get(RankCustomer);
}
export function removeRankCustomer() {
  return Cookies.remove(RankCustomer);
}

export function setTypeCare(name) {
  return Cookies.set(TypeCare, name);
}
export function getTypeCare() {
  return Cookies.get(TypeCare);
}
export function removeTypeCare() {
  return Cookies.remove(TypeCare);
}
