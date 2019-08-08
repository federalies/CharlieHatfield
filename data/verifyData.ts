// npx ts-node _scratch.ts

import fetch from 'node-fetch'
import { AWS_LISTED_TYPES } from './AWSListedTypes'
// import path from 'path'
// import fs from 'fs'

const zip = <T, U>(A: T[], B: U[]) => {
  let ret: [T, U][]
  if (A.length !== B.length) {
    throw new Error('not same length')
  }
  if (A.length < B.length) {
    ret = A.map((v, i) => {
      return [A[i], B[i]]
    })
  } else {
    ret = B.map((v, i) => {
      return [A[i], B[i]]
    })
  }
  return ret
}

const setDiff = (A: Set<string>, B: Set<string>): string[] => {
  return Array.from(A.keys()).reduce(
    (p, v) => {
      return B.has(v) ? [...p] : [v, ...p]
    },
    [] as string[]
  )
}
const setInterSection = (A: Set<string>, B: Set<string>): string[] => {
  return Array.from(A.keys()).reduce(
    (p, v) => {
      return B.has(v) ? [...p, v] : [...p]
    },
    [] as string[]
  )
}
;(async () => {
  // setup the batch of network calls.
  /*
    on url: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
    run this in console to update the URLs:
    ```js
    const listofCDNEndpoints = Array.from(document.querySelectorAll('#w222ab1c21c14c13 > tbody > tr > td:nth-child(3) > p > a'))
    listofCDNEndpoints.forEach(e=> console.log(e.href, '//' ,e.parentElement.parentElement.parentElement.childNodes[3].innerText))
    ```
    */
  const cloudfrontCDNs = [
    'd2senuesg1djtx', // ap-south-1
    'd2zq80gdmjim8k', // ap-northeast-3
    'd1ane3fvebulky', // ap-northeast-2
    'doigdx0kgq9el', // ap-southeast-1
    'd2stg8d246z9di', // ap-southeast-2
    'd33vqc0rt9ld30', // ap-northeast-1
    'd2s8ygphhesbe7', // ca-central-1
    'd1mta8qj7i28i2', // eu-central-1
    'd3teyb21fexa9r', // eu-west-1
    'd1742qcu2c1ncx', // eu-west-2
    'd2d0mfegowb3wk', // eu-west-3
    'diy8iv58sj6ba', // eu-north-1
    'd3c9jyj3w509b0', // sa-east-1
    'd1uauaxba7bl26', // us-east-1
    'dnwj8swjjbsbt', // us-east-2
    'd68hl49wbnanq', // us-west-1
    'd201a2mn26r7lk' // us-west-2
  ]
  const _path = 'latest/gzip/CloudFormationResourceSpecification.json'
  const results = await Promise.all(
    cloudfrontCDNs.map(subdomain => fetch(`https://${subdomain}.cloudfront.net/${_path}`))
  )

  // with responses availble, drop them on to the fs via createWriteStream
  const zipped = zip(cloudfrontCDNs, results)

  // Section Deals with making a cache on the fs
  //
  /*
    const fileDrops = zipped.map(async ([sub, r]) => {
        const res = await r.json()
        const _writePath = path.resolve(process.cwd(), `${sub}.json`)
        const f = fs.createWriteStream(_writePath)
        f.write(Buffer.from(JSON.stringify(res, null, 4)))
        f.close()
      })
      await Promise.all(fileDrops)

      const jq_filter =
        '[ .PropertyTypes | to_entries[] ] | map( select( .value | has( "Properties" )!=true ))'

      // look throutgh responses on fs
      fs.readdir('.', async (err, files) => {
        const importedResponses = await Promise.all(
          files.filter(f => f.endsWith('.json')).map(f => import(path.resolve(process.cwd(), `${f}`)))
        )
        console.log({ importedResponses })
      })
   */

  const d1 = await Promise.all(zipped.map(async ([sub, Resp]) => [sub, await Resp.json()]))
  const d2 = d1.reduce((prior, [sub, data]) => ({ ...prior, [`${sub}`]: data }), {}) as {
    [suburl: string]: {
      PropertyTypes: object
      ResourceTypes: object
      ResourceSpecificationVersion: '5.0.0'
    }
  }

  // console.log({ d2 })

  /**
   * ADD YOUR VALIDATION RULES, ADD THEM HERE
   * REALLY WhAT EVER YOU CAN THINK OF
   */
  // Setup Validation Rules
  const PropertyRules = [
    (name: string, data: any, propMap: any, resMap: any) => {
      // Every Property Entry should have a `Properties` entry
      return 'Properties' in data ? true : `${name} : Missing Properties`
    },
    (name: string, data: any, propMap: any, resMap: any) => {
      // Every Property Entry should have a `Documentation` entry
      return 'Documentation' in data ? true : `${name} : Missing Documentation`
    }
  ] as validationFn[]

  const ResourceRules = [
    (name: string, data: any, propMap: any, resMap: any) => {
      return 'Properties' in data ? true : `${name} : Missing Properties`
    },
    (name: string, data: any, propMap: any, resMap: any) => {
      return 'Documentation' in data ? true : `${name} : Missing Documentation`
    },
    (name: string, data: any, propMap: any, resMap: any) => {
      return AWS_LISTED_TYPES.includes(name) ? true : `Listed but not Covered w/ Sepcfile : ${name}`
    }
  ] as validationFn[]

  // perhaps grow this into more a structure output as oppose to a string output
  interface validationFn {
    (name: string, data: any, propMap: any, resMap: any): boolean | string
  }

  // Drive through the data
  Object.entries(d2).map(([sub, urlRespData]) => {
    console.log(
      { v: urlRespData.ResourceSpecificationVersion },
      `https://${sub}.cloudfront.net/${_path}`
    )
    const rValidations = Object.entries(urlRespData.ResourceTypes).map(([name, rData]) => {
      const errList = ResourceRules.reduce(
        (p, f) => {
          const r = f(name, rData, urlRespData.ResourceTypes, urlRespData.PropertyTypes)
          return typeof r === 'string' ? [...p, r] : [...p]
        },
        [] as string[]
      )
      return errList.length > 0 ? errList : true
    })
    const pValidations = Object.entries(urlRespData.PropertyTypes).map(([name, pData]) => {
      const errList = PropertyRules.reduce(
        (p, f) => {
          const r = f(name, pData, urlRespData.ResourceTypes, urlRespData.PropertyTypes)
          return typeof r === 'string' ? [...p, r] : [...p]
        },
        [] as string[]
      )
      return errList.length > 0 ? errList : true
    })

    const listedNotCovered = ((subdomain, data) => {
      const listed = new Set(AWS_LISTED_TYPES)
      const covered = new Set(Object.keys(data.ResourceTypes))
      return setDiff(listed, covered)
    })(sub, urlRespData)

    console.log({ pValidations: pValidations.filter(e => typeof e !== 'boolean') })
    console.log({ rValidations: rValidations.filter(e => typeof e !== 'boolean') })
    console.log({ listedNotCovered })

    console.log('\n\n')
  })
})()
