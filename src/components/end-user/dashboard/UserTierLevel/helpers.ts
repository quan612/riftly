export function getPoints(level) {
  return ((Math.pow(level, 2) + level) / 2) * 100 - level * 100
}

export function getLevel(points) {
  const level = (Math.sqrt(100 * (2 * points + 25)) + 50) / 100
  return Math.floor(level)
}
