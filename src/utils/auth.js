import Cookies from "js-cookie";

const TokenKey = "TokenCRM";
const UserName = "UserNameCRM";
const FullName = "FullNameCRM";
const PhoneNumber = "PhoneNumberCRM";

const TypeCare = "TypeCareCRM";
const EmployCode = "CommuneCRM";
const PlaceName = "PlaceNameCRM";
const TypePlace = "TypePlaceCRM";
const PageNumber = "PageNumberCRM";
const RowspPage = "RowspPageCRM";
const StatusCustomer = "StatusCustomerCRM";
const RankCustomer = "RankCustomerCRM";
const AccessTokenCRM = "AccessTokenCRM";
const SipUserCRM = 'SipUserCRM'
const PassOMICRM = 'PassOMICRM'
const DomainOmiCRM = 'DomainOmiCRM'


export function setSipUser(token) {
  return Cookies.set(SipUserCRM, token, { expires: 356 });
}
export function getSipUser() {
  return Cookies.get(SipUserCRM);
}
export function removeSipUser() {
  return Cookies.remove(SipUserCRM);
}

export function setPassOMI(token) {
  return Cookies.set(PassOMICRM, token, { expires: 356 });
}
export function getPassOMI() {
  return Cookies.get(PassOMICRM);
}
export function removePassOMI() {
  return Cookies.remove(PassOMICRM);
}

export function setDomain(token) {
  return Cookies.set(DomainOmiCRM, token, { expires: 356 });
}
export function getDomain() {
  return Cookies.get(DomainOmiCRM);
}
export function removeDomain() {
  return Cookies.remove(DomainOmiCRM);
}

export function setAccessToken(token) {
  return Cookies.set(AccessTokenCRM, token, { expires: 356 });
}
export function getAccessToken() {
  return Cookies.get(AccessTokenCRM);
}
export function removeAccessToken() {
  return Cookies.remove(AccessTokenCRM);
}

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

export function setPlaceName(name) {
  return Cookies.set(PlaceName, name);
}
export function getPlaceName() {
  return Cookies.get(PlaceName);
}
export function removePlaceName() {
  return Cookies.remove(PlaceName);
}

export function setTypePlace(name) {
  return Cookies.set(TypePlace, name);
}
export function getTypePlace() {
  return Cookies.get(TypePlace);
}
export function removeTypePlace() {
  return Cookies.remove(TypePlace);
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

export function setStatusCustomer(name) {
  return Cookies.set(StatusCustomer, name);
}
export function getStatusCustomer() {
  return Cookies.get(StatusCustomer);
}
export function removeStatusCustomer() {
  return Cookies.remove(StatusCustomer);
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

