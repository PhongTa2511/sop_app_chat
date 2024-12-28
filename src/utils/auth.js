import Cookies from "js-cookie";

const TokenKey = "TokenDTP";
const UserName = "UserNameDTP";
const FullName = "FullNameDTP";
const PhoneNumber = "PhoneNumberDTP";

const Position = "PositionDTP";
const EmployCode = "CommuneDTP";
const UserID = "UserIDDTP";
const Email = "EmailDTP";
const PageNumber = "PageNumberDTP";
const RowspPage = "RowspPageDTP";
const Avatar = "AvatarDTP";
const Specialize = "SpecializeDTP";
const ComID = "ComIDDTP";

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

export function setSpecialize(name) {
  return Cookies.set(Specialize, name);
}
export function getSpecialize() {
  return Cookies.get(Specialize);
}
export function removeSpecialize() {
  return Cookies.remove(Specialize);
}

export function setPosition(name) {
  return Cookies.set(Position, name);
}
export function getPosition() {
  return Cookies.get(Position);
}
export function removePosition() {
  return Cookies.remove(Position);
}
