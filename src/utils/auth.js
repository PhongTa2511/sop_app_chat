const TokenKey = "TokenDTP"
const UserName = "UserNameDTP"
const FullName = "FullNameDTP"
const PhoneNumber = "PhoneNumberDTP"

const Role = "RoleDTP"
const EmployCode = "CommuneDTP"
const UserID = "UserIDDTP"
const Email = "EmailDTP"
const PageNumber = "PageNumberDTP"
const RowspPage = "RowspPageDTP"
const Avatar = "AvatarDTP"
const Specialize = "SpecializeDTP"

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}
export function getToken() {
  return localStorage.getItem(TokenKey)
}
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function setUserName(name) {
  return localStorage.setItem(UserName, name)
}
export function removeUserName() {
  return localStorage.removeItem(UserName)
}
export function getUserName() {
  return localStorage.getItem(UserName)
}

export function setFullName(time) {
  return localStorage.setItem(FullName, time)
}
export function getFullName() {
  return localStorage.getItem(FullName)
}
export function removeFullName() {
  return localStorage.removeItem(FullName)
}

export function setPhoneNumber(phoneNumber) {
  return localStorage.setItem(PhoneNumber, phoneNumber)
}
export function getPhoneNumber() {
  return localStorage.getItem(PhoneNumber)
}
export function removePhoneNumber() {
  return localStorage.removeItem(PhoneNumber)
}

export function setEmployCode(name) {
  return localStorage.setItem(EmployCode, name)
}
export function getEmployCode() {
  return localStorage.getItem(EmployCode)
}
export function removeEmployCode() {
  return localStorage.removeItem(EmployCode)
}

export function setUserID(name) {
  return localStorage.setItem(UserID, name)
}
export function getUserID() {
  return localStorage.getItem(UserID)
}
export function removeUserID() {
  return localStorage.removeItem(UserID)
}

export function setEmail(name) {
  return localStorage.setItem(Email, name)
}
export function getEmail() {
  return localStorage.getItem(Email)
}
export function removeEmail() {
  return localStorage.removeItem(Email)
}

export function setPageNumber(name) {
  return localStorage.setItem(PageNumber, name)
}
export function getPageNumber() {
  return localStorage.getItem(PageNumber)
}
export function removePageNumber() {
  return localStorage.removeItem(PageNumber)
}

export function setRowspPage(name) {
  return localStorage.setItem(RowspPage, name)
}
export function getRowspPage() {
  return localStorage.getItem(RowspPage)
}
export function removeRowspPage() {
  return localStorage.removeItem(RowspPage)
}

export function setAvatar(name) {
  return localStorage.setItem(Avatar, name)
}
export function getAvatar() {
  return localStorage.getItem(Avatar)
}
export function removeAvatar() {
  return localStorage.removeItem(Avatar)
}

export function setSpecialize(name) {
  return localStorage.setItem(Specialize, name)
}
export function getSpecialize() {
  return localStorage.getItem(Specialize)
}
export function removeSpecialize() {
  return localStorage.removeItem(Specialize)
}

export function setRole(name) {
  return localStorage.setItem(Role, name)
}
export function getRole() {
  return localStorage.getItem(Role)
}
export function removeRole() {
  return localStorage.removeItem(Role)
}
