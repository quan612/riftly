export const isNotDoneFirst = (a, b) => {
  return Number(a.hasStarted) - Number(b.hasStarted)
}
export const isAlphabeticallly = (a, b) => {
  return a.text.localeCompare(b.text)
}
