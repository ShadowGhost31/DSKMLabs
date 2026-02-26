export type Pair = [number, number]

export const uniqPairs = (pairs: Pair[]): Pair[] => {
  const seen = new Set<string>()
  const out: Pair[] = []
  for (const [a, b] of pairs) {
    const k = `${a},${b}`
    if (!seen.has(k)) {
      seen.add(k)
      out.push([a, b])
    }
  }
  return out
}

export const sortPairs = (pairs: Pair[]): Pair[] => {
  return [...pairs].sort((p, q) => (p[0] - q[0]) || (p[1] - q[1]))
}

export const union = (A: Pair[], B: Pair[]): Pair[] => uniqPairs([...A, ...B])

export const intersection = (A: Pair[], B: Pair[]): Pair[] => {
  const s = new Set(B.map(p => `${p[0]},${p[1]}`))
  return A.filter(p => s.has(`${p[0]},${p[1]}`))
}

export const diff = (A: Pair[], B: Pair[]): Pair[] => {
  const s = new Set(B.map(p => `${p[0]},${p[1]}`))
  return A.filter(p => !s.has(`${p[0]},${p[1]}`))
}

export const symDiff = (A: Pair[], B: Pair[]): Pair[] => union(diff(A, B), diff(B, A))

export const cartesian = (X: number[], Y: number[]): Pair[] => {
  const out: Pair[] = []
  for (const x of X) for (const y of Y) out.push([x, y])
  return out
}

export const compose = (P: Pair[], Q: Pair[]): Pair[] => {
  const map = new Map<number, number[]>()
  for (const [c, d] of Q) {
    const arr = map.get(c)
    if (arr) arr.push(d)
    else map.set(c, [d])
  }
  const out: Pair[] = []
  for (const [a, c] of P) {
    const ds = map.get(c)
    if (!ds) continue
    for (const d of ds) out.push([a, d])
  }
  return uniqPairs(out)
}

export const isReflexive = (A: number[], R: Pair[]): boolean => {
  const s = new Set(R.map(p => `${p[0]},${p[1]}`))
  return A.every(a => s.has(`${a},${a}`))
}

export const isSymmetric = (R: Pair[]): boolean => {
  const s = new Set(R.map(p => `${p[0]},${p[1]}`))
  return R.every(([a, b]) => s.has(`${b},${a}`))
}

export const isAntisymmetric = (R: Pair[]): boolean => {
  const s = new Set(R.map(p => `${p[0]},${p[1]}`))
  for (const [a, b] of R) {
    if (a !== b && s.has(`${b},${a}`)) return false
  }
  return true
}

export const isTransitive = (R: Pair[]): boolean => {
  const s = new Set(R.map(p => `${p[0]},${p[1]}`))
  for (const [a, b] of R) {
    for (const [c, d] of R) {
      if (b === c && !s.has(`${a},${d}`)) return false
    }
  }
  return true
}

export const pairsToText = (pairs: Pair[]): string => {
  const ps = sortPairs(uniqPairs(pairs))
  if (ps.length === 0) return '∅'
  return '{ ' + ps.map(([a, b]) => `(${a}, ${b})`).join(', ') + ' }'
}

export const parseNumberList = (text: string): number[] => {
  const cleaned = text.replace(/[\[\]{}()]/g, ' ')
  const parts = cleaned.split(/[^-0-9]+/).filter(Boolean)
  const nums = parts.map(p => Number(p)).filter(n => Number.isFinite(n))
  const out: number[] = []
  const seen = new Set<number>()
  for (const n of nums) {
    if (!seen.has(n)) {
      seen.add(n)
      out.push(n)
    }
  }
  return out
}
