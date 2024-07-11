import Cookies from "js-cookie";

const TokenKey = "TokenILAB";
const UserName = "UserNameILAB";
const FullName = "FullNameILAB";
const PhoneNumber = "PhoneNumberILAB";

const TypeCare = "TypeCareILAB";
const EmployCode = "CommuneILAB";
const PlaceName = "PlaceNameILAB";
const TypePlace = "TypePlaceILAB";
const PageNumber = "PageNumberILAB";
const RowspPage = "RowspPageILAB";
const StatusCustomer = "StatusCustomerILAB";
const RankCustomer = "RankCustomerILAB";
const AccessTokenILAB = "AccessTokenILAB";
const SipUserILAB = "SipUserILAB";
const PassOMIILAB = "PassOMIILAB";
const DomainOmiILAB = "DomainOmiILAB";

export function setSipUser(token) {
  return Cookies.set(SipUserILAB, token, { expires: 356 });
}
export function getSipUser() {
  return Cookies.get(SipUserILAB);
}
export function removeSipUser() {
  return Cookies.remove(SipUserILAB);
}

export function setPassOMI(token) {
  return Cookies.set(PassOMIILAB, token, { expires: 356 });
}
export function getPassOMI() {
  return Cookies.get(PassOMIILAB);
}
export function removePassOMI() {
  return Cookies.remove(PassOMIILAB);
}

export function setDomain(token) {
  return Cookies.set(DomainOmiILAB, token, { expires: 356 });
}
export function getDomain() {
  return Cookies.get(DomainOmiILAB);
}
export function removeDomain() {
  return Cookies.remove(DomainOmiILAB);
}

export function setAccessToken(token) {
  return Cookies.set(AccessTokenILAB, token, { expires: 356 });
}
export function getAccessToken() {
  return Cookies.get(AccessTokenILAB);
}
export function removeAccessToken() {
  return Cookies.remove(AccessTokenILAB);
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
