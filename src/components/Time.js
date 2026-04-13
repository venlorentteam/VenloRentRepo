// Shared time-ago formatter for feed/profile timestamps.
export const timeAgo = (date) => {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = Math.max(0, now - then)

  const sec = Math.floor(diff / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  const wk = Math.floor(day / 7)
  const mo = Math.floor(day / 30)
  const yr = Math.floor(day / 365)

  if (sec < 60) return `${sec}s ago`
  if (min < 60) return `${min} min ago`
  if (hr < 24) return `${hr}h ago`
  if (day < 7) return `${day}d ago`
  if (wk < 5) return `${wk}w ago`
  if (mo < 12) return `${mo}mo ago`
  return `${yr}y ago`
}
