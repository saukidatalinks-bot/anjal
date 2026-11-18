export function formatMoney(amount, currency = 'NGN') {
  if (amount === null || amount === undefined || amount === '') {
    return 'Custom'
  }

  if (typeof amount === 'string') {
    const trimmed = amount.trim()
    if (!trimmed) return 'Custom'
    if (/(custom|free|included|contact|tbd)/i.test(trimmed)) return trimmed
    if (trimmed.startsWith('₦')) return trimmed

    const numericPart = trimmed.replace(/[^0-9.-]/g, '')
    const parsed = Number(numericPart)
    if (!numericPart || !Number.isFinite(parsed)) {
      return trimmed
    }

    const suffix = trimmed.endsWith('+') ? '+' : ''
    const rounded = Math.round(parsed)
    return currency === 'USD'
      ? `$${rounded.toLocaleString('en-US')}${suffix}`
      : `₦${rounded.toLocaleString('en-NG')}${suffix}`
  }

  const value = Number(amount)
  if (!Number.isFinite(value)) return 'Custom'
  const rounded = Math.round(value)
  return currency === 'USD'
    ? `$${rounded.toLocaleString('en-US')}`
    : `₦${rounded.toLocaleString('en-NG')}`
}

export function formatNaira(amount) {
  return formatMoney(amount, 'NGN')
}
