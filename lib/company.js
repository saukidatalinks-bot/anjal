export const companyName = 'ANJAL SOLUTIONS LTD'
export const companyDisplayName = 'Anjal Solutions LTD'
export const companyPreviousNameNotice = 'Corporate successor to Anjal Ventures (RC 9258709) and Sauki Data Links (SMEDAN ID: SUID-9914-4253-4924-5237)'
export const legalEntityType = 'Private Company Limited by Shares (Registered under CAMA 2020)'
export const registeredCacNumber = '9854225'
export const registeredTinNumber = '2623598796685'
export const registeredDunsNumber = '352297161'
export const legacyVenturesRcNumber = '9258709'
export const smedanIdNumber = 'SUID-9914-4253-4924-5237'
export const registeredOfficeAddress =
  'No. 4, Kolomi Ali Street, Njiwaji Layout, Sabon Fegi, Damaturu, Yobe State, Nigeria'
export const certificateUrl = '/docs/certificate-anjal-solutions-ltd.pdf'

export const officialWebsites = [
  'https://www.anjalsolutionsltd.com',
  'https://www.anjalventures.com',
]

export const officialEmails = {
  general: 'office@anjalsolutionsltd.com',
  secondary: 'contact@anjalventures.com',
  developer: 'developers@anjalventures.com',
}

export const officialPhone = '+234 816 413 5836'
export const officialWhatsapp = '2348164135836'
export const managementSignoff = 'Signed, Management — ANJAL SOLUTIONS LTD'

export function normalizeCompanyAddress(address) {
  if (!address || address.trim() === 'Damaturu, Yobe State, Nigeria' || address.includes('MJG')) {
    return registeredOfficeAddress
  }
  return address
}

export function normalizeCacNumber(cac) {
  if (!cac) return registeredCacNumber
  const cleaned = String(cac).replace(/^(BN|RC)\s*[:\-\s]?\s*/i, '').trim()
  if (cleaned === '9258709' || !cleaned) return registeredCacNumber
  return cleaned
}

export function normalizeTinNumber(tin) {
  if (!tin || tin === '2623553716975') return registeredTinNumber
  return String(tin).trim()
}

export function normalizeDunsNumber(duns) {
  if (!duns) return registeredDunsNumber
  return String(duns).trim()
}
