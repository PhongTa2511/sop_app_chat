
const title = 'Quản lý quy trình DTP' || 'CPC1HN'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
