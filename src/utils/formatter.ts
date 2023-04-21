export function handelDate(dateStr: string) {
  const date = new Date(dateStr)

  return date.toLocaleDateString()
}
