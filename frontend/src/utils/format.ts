const priceFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

export function formatPrice(value: number) {
  return priceFormatter.format(value)
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}