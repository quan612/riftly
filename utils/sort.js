export const isNotDoneFirst = (a, b) => {
  return Number(a.isDone) - Number(b.isDone);
}
export const isAlphabeticallly = (a, b) => {
  return a.text.localeCompare(b.text);
}