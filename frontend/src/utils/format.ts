const priceFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

export function formatPrice(value: number) {
  return priceFormatter.format(value)
}