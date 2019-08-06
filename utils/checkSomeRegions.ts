import fetch from 'node-fetch'
;(async () => {
  // setup CDN sub domains
  const cloudfrontCDN = [
    'd68hl49wbnanq', // USA/NCali
    'dnwj8swjjbsbt', // USA/Ohio
    'd1uauaxba7bl26', // US/Virgina
    'd1742qcu2c1ncx', // GB/LondonTown
    'd33vqc0rt9ld30', // JP/Tokyo
    'd2senuesg1djtx' // IN/Mumbai
  ]
  const path = 'latest/gzip/CloudFormationResourceSpecification.json'

  const rArr = await Promise.all(
    cloudfrontCDN.map(subdomain => fetch(`https://${subdomain}.cloudfront.net/${path}`))
  )
  const resultsArr = await Promise.all(
    rArr.map(async r => ({ _url: r.url, _json: await r.json() }))
  )

  const completedData: any = resultsArr.reduce(
    (p: any, v: any) => {
      const { _url, _json } = { _url: v._url, _json: v._json as object }
      const urlResult = Object.entries((_json as any).PropertyTypes).map(([prop, propData]) => {
        if (!('Properties' in (propData as any))) {
          return { prop, propData }
        }
      })
      console.log(`\n\n\n\n`)
      console.log(_url)
      console.log(urlResult.filter(v => v))
      p[_url] = urlResult.filter(v => v)
      return p
    },
    {} as { [s: string]: { prop: string; propData: any } }
  )
  console.log(completedData)
  return completedData
})()
