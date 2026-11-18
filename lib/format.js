export function formatMoney(amount, currency = 'NGN') {
  const value = Math.round(Number(amount || 0))
  if (currency === 'USD') {
    return `$${value.toLocaleString('en-US')}`
  }
  return `₦${value.toLocaleString('en-NG')}`
}

export function formatNaira(amount) {
  return formatMoney(amount, 'NGN')
}
