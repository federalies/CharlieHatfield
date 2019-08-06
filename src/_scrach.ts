const isAllCaps = (s: string) => {
  return [...s].every(v => v === v.toUpperCase())
}

console.log('Eric', isAllCaps('Eric'))
console.log(' Moore', isAllCaps(' Moore'))
console.log('ERIC', isAllCaps('ERIC'))
console.log(' SOME !', isAllCaps(' SOME !'))
