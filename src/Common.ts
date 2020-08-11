export function countNumWords(s: string): number {
  return s.match(/\S+/g)?.length ?? 0
}
