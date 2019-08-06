#! ts-node
// $> npx ts-node utils/checkCfmDefSig.ts

import crypto from 'crypto'
import multihash from "multihashes"
import fetch from "node-fetch"
import awsCfmDefs from "../data/cloudformation_20190731.awsformat.json"
import { IAWSDefTop } from '../src/sourceFile.js';

( async ()=>{
    const r = await fetch('https://d1742qcu2c1ncx.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json')
    const r_json = await r.json()
    const ETag = r.headers.get('ETag')

    const sha1_net =  crypto
        .createHash("sha1")
        .update(JSON.stringify(r_json))
        .digest("hex")
    const sha1_netHashBuffer = multihash.encode(Buffer.from(sha1_net), 'sha1')
    const sha1_netHashBuffer_B64 = sha1_netHashBuffer.toString('base64')


    const sha1_fsdata = crypto
    .createHash("sha1")
    .update(JSON.stringify(awsCfmDefs))
    .digest("hex")

    const sha1_fsHashBuffer = multihash.encode(Buffer.from(sha1_fsdata), 'sha1')
    const sha1_fsHashBuffer_B64 = sha1_fsHashBuffer.toString('base64')

    const Version = (r_json as unknown as IAWSDefTop).ResourceSpecificationVersion
    console.log({ETag, Version } )
    console.log({sha1_net, sha1_fsdata})
    console.log({ sha1_netHashBuffer_B64, sha1_fsHashBuffer_B64 })

    // const t = new TextDecoder('base64 to utf8').encoding('')

    const r1 = multihash.decode(Buffer.from('ESg5YmE5NTI3NWYwMTExZjJkZjNlZTY1NGEzMWUxMTI2MjUyMGQ5NmZh', 'base64'))
    
    console.log( {...r1, digest:r1.digest.toString() } )
})()