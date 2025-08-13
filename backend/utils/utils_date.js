export function toDateOnly(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  dt.setHours(0,0,0,0);
  return dt;
}

export function businessDaysBetween(start, end) {
  const s = toDateOnly(start);
  const e = toDateOnly(end);
  if (!s || !e) return null;
  if (e < s) return null;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay(); // 0=Sun,6=Sat
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  const as = toDateOnly(aStart);
  const ae = toDateOnly(aEnd);
  const bs = toDateOnly(bStart);
  const be = toDateOnly(bEnd);
  return as <= be && bs <= ae;
}
