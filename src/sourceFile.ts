/**
 * file: sourceFile is the class model of a squals source file 
 * author: Eric Moore
 * 
 * @todo: fix generic validation function -  i as squals +  < className > 
 * @todo: Special handle :: Tags?: ITags[] && tags?: Itags[]
 * @todo: Go ahead and build out the validation function for JSON?
 * @todo: Suffers from race condition - cli fails sometimes - run again and sometimes it works
 * @todo: add funciotn output types to squal methods + type methods (Not attributes)
 * @todo: can large interfaces be broken down into smaller chunks automattically
 * @todo: What about incorporating AJV + JSON Schemas? Seems like it already handles some enum craziness? 
 * @todo: can we sort the parts of the interfaces so that the ? are below the required elements
 * @todo: can the input be typed when building methods
 * @todo: in the cli normalize the CLI inputs such the inputs are de-deuped and prefer the most specfic versions under the de-dupe scheme
 */
// import { flow } from "lodash-es"
// import crypto from "crypto"
// import multihash from "multihashes"
import fetch from "node-fetch"

export class SqualsFile {
   filename: string
   Class: string
   awsType: string
   ClassExts: {
      implements: string[]
      extends?: string[]
   }
   sections: {
      _imports: string[]
      _methodObjs : Imethods
      _attributes: IStrToStr
      _interfaces: {
         _min: string
         _props: string
         _json: string
         [str: string]: string
      }
      
   }
   static awsDefinitionFile?: IAWSDefTop
   static dataFrom?: string

   constructor(fileName: string, className: string, awsType: string) {
      this.awsType = awsType
      this.filename = fileName.endsWith('.ts') ? fileName : fileName +'.ts'
      this.Class = className
      this.ClassExts = {
         implements: ["squals"]
      }
      this.sections = {
         _imports: [""],
         _attributes: {},
         _interfaces: {
            _min: "",
            _props: "",
            _json: ""
         },
         _methodObjs:{}
      }
      this.sections._attributes = {
         name: "string",
         Type: `'${this.awsType}'`,
         Properties: `I${this.Class}_props`
      }
      this.sections._imports = [
         `// @todo post-code-generation`,
         `// `,
         `// 1. Go through and remove all refs of object`,
         `// 2. Look for enums in the documentation`,
         `// 3. Flatten deep structures in the _min interface`,
         `// 4. finish the constructor that maps the _min inputs to the _props outputs`,
         `// 5. Look at the relationship between objects - consider if there would be a need for a _linkedData = {stringKey: object[] }`,
         `// 6. Look for MultiMode, All-optional sections - and teas out if that should be a required union type Ex: LmabdaFunction:Code`,
         `// 7. Chop Up Mega interfaces to make them more apprachable Ex: S3-Bucket`,
         `// 8. Deal with remaining typescript warnings`,
         `// `, 
         `import { 
            squals, 
            struct, 
            baseSchemas, 
            validatorGeneric, 
            genComponentName, 
            IStrRefGetAtt, 
            IGetAtt, 
            ITags, 
            Itags,
            IRef
         } from '../Template'`,
         `import { 
            verifyIfThen, 
            ifHas, 
            multipleOf, 
            stringNotEqual, 
            ifType 
         } from '../../utils/validations/objectCheck'`,
         

      ]
      this.sections._interfaces = { _min: "", _props: "", _json: "" }
      this.sections._methodObjs = {
         'constructor':{
            name:'constructor',
            body:`
            this.name = genComponentName()
            this.Properties = {}
            // finish the constructor`,
         },
         'fromString':{
            name:'fromString',
            modifiers:['static'],
            args:[{alias:'s', type:'string'}],
            returns:`${this.Class}.validate(JSON.parse(s))`,
         },
         'fromJSON':{
            name:'fromJSON',
            modifiers:['static'],
            args:[{alias:'i', type:'object'}],
            returns:`${this.Class}.validateJSON(i as I${this.Class}_json )`
         },
         'fromJS':{
            name:'fromJS',
            modifiers:['static'],
            args:[{alias:'i', type:'object'}],
            returns:` ${this.Class}.validateJS(i as I${this.Class}_min )`
         },
         'from':{
            name:'from',
            modifiers:['static'],
            args:[{alias:'i', type:'string | object'}],
            returns:` ${this.Class}.validate(i)`
         },
         'validate':{
            name:'validate',
            modifiers:['static'],
            args:[{alias:'i', type:'string | object'}],
            returns:` validatorGeneric<${this.Class}>(i)`
         },
         'validateJS':{
            name:'validateJS',
            modifiers:['static'],
            args:[{alias:'i', type:`I${this.Class}_min`}],
            body:`throw new Error('not implemented yet')`,
         },
         'validateJSON':{
            name:'validateJSON',
            modifiers:['static'],
            args:[{alias:'i', type:`I${this.Class}_json`}],
            body:`throw new Error('not implemented yet')`,
         },
         '_name':{
            name:'_name',
            args:[{alias:'s', type:'string'}],
            body:'this.name = s',
            returns:`this`
         },
         'toJSON':{
            name:'toJSON',
            returns:` {[this.name]:{
               Type:${this.sections._attributes.Type},
               Properties: this.Properties
           }}`
         },
      }
   }

   /**
    *
    * @param awsVersion
    * @param isList
    * ```js
    * const str = transformAWSPrims('String', true) console.log(str) // string[]
    * const int = transformAWSPrims('Integer', false) console.log(int) // number
    * ```
    */
   static transformAWSPrims = (awsVersion?: IawsPrims, isList?: boolean) => {
      switch (awsVersion) {
         case "Boolean":
            return `boolean${isList ? "[]" : ""}`
         case "Integer":
         case "Double":
         case "Long":
            return `number${isList ? "[]" : ""}`
         case "Json":
            return `{[str:string]: object }${isList ? "[]" : ""}`
         case "Timestamp":
            return `Date${isList ? "[]" : ""}`
         case "String":
            default:
            return `IStrRefGetAtt${isList ? "[]" : ""}`
      }
   }

   /**
    * @description inject AWS Cfm Definitions pragmatically, or via network call
    * @param awsDefObj
    */
   static async fromAwsCfmDef(awsDefObj?: any) {
      if (awsDefObj) {
         SqualsFile.dataFrom = 'local'
         SqualsFile.awsDefinitionFile = awsDefObj as IAWSDefTop
      } else {
         // setup CDN sub domains
         const cloudfrontCDNs = [
            "d68hl49wbnanq", // USA/NCali
            "dnwj8swjjbsbt", // USA/Ohio
            "d1uauaxba7bl26", // US/Virgina
            "d1742qcu2c1ncx", // GB/LondonTown
            "d33vqc0rt9ld30", // JP/Tokyo
            "d2senuesg1djtx" // IN/Mumbai
         ]
         const path = "latest/gzip/CloudFormationResourceSpecification.json"

         // races the URL for closeness
         const r = await Promise.race(
            cloudfrontCDNs.map(subdomain =>
               fetch(`https://${subdomain}.cloudfront.net/${path}`)
            )
         )
         console.warn({awsDefObj, urlUsed: r.url})

         SqualsFile.dataFrom = r.url
         SqualsFile.awsDefinitionFile = Object.freeze(await r.json())
         
      }
      return SqualsFile.awsDefinitionFile
/**
       * consider doing something here so that the tool can alert users 
       * if the defintion file changes while the script is running
       * 
       * Clearly adding increasing the signal factor there is of interest so 
       * only notifying when its a "meaningful" change would be good
       */
      


      // // find out if anything changed?
      // // setup the HashBuffer
      // const sha1HashBuffer = 
      // multihash.encode(
      //    Buffer.from(crypto
      //       .createHash("sha1")
      //       .update(JSON.stringify(SqualsFile.awsDefinitionFile))
      //       .digest("hex")),
      //    "sha1"
      // )
      // 
      // if we dont have one yet - set it
      // if(!SqualsFile.msh1Buffer_ofAWSCfmDefs){
      //    SqualsFile.msh1Buffer_ofAWSCfmDefs = sha1HashBuffer
      // } else {
      //    // if stuff changed, print it
      //    if( sha1HashBuffer.compare(SqualsFile.msh1Buffer_ofAWSCfmDefs) !==0 ){
      //       console.warn(`The cloudformation definition file changed during use`)
      //       console.warn(`codebase:mSha1.base64 =${SqualsFile.cacheIDs.sha1mHash_B64}`+'\n'+ 
      //        `network:mSha1.base64 = ${sha1HashBuffer.toString('base64')}`)
      //    }

      //    if(!SqualsFile.cacheIDs.sha1mHash_B64.includes(sha1HashBuffer.toString('base64'))){
      //       console.warn(`squals codebase might be out of date as the defintion file has changed`+
      //       ` - discover what changed between the fs://data folder and the http:// versions`)
            
      //       console.warn(`codebase:mSha1.base64 = ${SqualsFile.cacheIDs.sha1mHash_B64} `+'\n'+ 
      //       ` && network:mSha1.base64 = ${sha1HashBuffer.toString('base64')}`)
      //    }
      //    // console.log({'squalsFile.mhash_b64': SqualsFile.SHA1ofDefFile.toString('base64')})
      //    // console.log({'net.mhash_b64':sha1HashBuffer.toString('base64')})
      // }
           
   }

   async attributes(a: IStrToStr) {
      this.sections._attributes = { ...a, ...this.sections._attributes }
      return this
   }
   
   async imports(...s: string[]) {
      this.sections._imports = this.sections._imports.concat(s)
      return this
   }

   /**
    * @description EasyButton
    * @param awsDefObj 
    */
   async gen(awsDefObj?: any){
     await SqualsFile.fromAwsCfmDef(awsDefObj)
     return (await this.genMethods()).genInterfaces()
   }

   async genInterfaces(awsDefs?: IAWSDefTop) {
      if(!SqualsFile.awsDefinitionFile){
         console.warn("No defintion file? - call the defintion file handler")
         await SqualsFile.fromAwsCfmDef(awsDefs)
      }
      
      const firstLower = (s:string )=>{
         return `${s[0].toLowerCase()}${s.slice(1)}`
      }

      const propsInterfacesObj = this.__interfaces(
         this.awsType, // will not change through the recursion calls
         this.awsType, // this WILL change via recursion calls
         "resource",
         Object.freeze((SqualsFile.awsDefinitionFile as IAWSDefTop).ResourceTypes),
         Object.freeze((SqualsFile.awsDefinitionFile as IAWSDefTop).PropertyTypes)
      )

      const _minObj = Object.entries(propsInterfacesObj).reduce(
         (prior, [key, value]) => ({ ...prior, [firstLower(key)]: value }),{})

      const _props = `interface I${this.Class}_props
        ${JSON.stringify(propsInterfacesObj, null, 3)}
      `

      const _json = `interface I${this.Class}_json {
      [n:string]:{
          Type: '${this.awsType}'
          Properties: I${this.Class}_props
        }
      }`

      const _min = `interface I${this.Class}_min 
        ${JSON.stringify(_minObj, null, 3)}
      `

      this.sections._interfaces = {
         ...this.sections._interfaces,
         _min,
         _props,
         _json,
      }
      return this
   }

   async genMethods() {
      if(!SqualsFile.awsDefinitionFile){
         await SqualsFile.fromAwsCfmDef()
      }

      this.sections._methodObjs = {...this.sections._methodObjs,
         ...this.__methods(
            this.awsType,
            this.awsType,
            "resource",
            (SqualsFile.awsDefinitionFile as IAWSDefTop).ResourceTypes,
            (SqualsFile.awsDefinitionFile as IAWSDefTop).PropertyTypes
         )
      }

      return this
   }

   methods_toString(name:string, data:Imethod_Elements){
      const d = {
         name: data.name,
         docString: data.docString ? data.docString  : '',
         modifiers: data.modifiers ? data.modifiers : [],
         args: data.args ? data.args : [],
         body: data.body ? data.body : '',
         returns: data.returns ? data.returns : '',
      }
         
      const _args = d.args.map(v=>`${v.alias}: ${v.type}`)
      
      let ret  = `${d.docString}
      ${d.modifiers.join(' ')} ${d.name} ( ${d.args.length>0 ? _args : ''} ) { 
         ${d.body}`

      ret += d.returns.length>0 ? `\n return ${d.returns} \n } \n` : '\n } \n'
      return ret
   }
   
   _attibutesToString(attributeObj:IStrToStr):string{
      return Object.entries(attributeObj).reduce((p,[key, value])=>{
         p+= `${key} :${value} \n`
         return p
      },'').replace("Type :", "Type = ")
   }

   toString():string{
      return `
      ${this.sections._imports.join('\n')}
      class ${this.Class} implements ${this.ClassExts.implements.join(', ')} {
         ${this._attibutesToString(this.sections._attributes)}
         ${Object.entries(this.sections._methodObjs)
            .map(([n,d])=>this.methods_toString(n,d))
            .join('\n')}
      }
      //# region interfaces
      ${this.sections._interfaces._min.replace(/"/g,'')}
      ${this.sections._interfaces._props.replace(/"/g,'')}
      ${this.sections._interfaces._json.replace(/"/g,'')}
      //# endregion interfaces

      `
   }

   /**
    * @description Functional Core for Data Processing (sync)
    * @param awsType eg: "AWS::Lambda::Function.SomeProperty"
    * @param resourceMap is the ResourceTypes section of the giant AWS CFM definition
    * @param propertyMap is the ResourceTypes section of the giant AWS CFM definition
    */
   __attributes(
      awsType: string,
      lookUp: string,
      lookIn: "resource" | "property",
      resourceMap: { [s: string]: IAWSCfmDefs },
      propertyMap: { [s: string]: IAWSCfmDefs }
   ) {}

   /**
    *
    * @param awsType
    * @param lookUp
    * @param lookIn - "resource" | "property",
    * @param resourceMap
    * @param propertyMap
    */
   __methods(
      awsType: string,
      lookUp: string,
      lookIn: "resource" | "property",
      resourceMap: { [s: string]: IAWSCfmDefs },
      propertyMap: { [s: string]: IAWSCfmDefs }
   ): Imethods {
      
      let ret: string[] = [
         `Ref():IRef {
            return {Ref: this.name}
          }`
      ]

      const firstLower = (s:string )=>{
         return `${s[0].toLowerCase()}${s.slice(1)}`
      }

      const propertyMethods = Object.entries(
         resourceMap[awsType].Properties
      ).reduce(
         (p: Imethods,[propertyName, propertyDef]) => {
            if(propertyName.toLowerCase() ==='name'){
               // The Definition Naturally included an attribute included Name (or simliar)
               // So dont include the expression builder method for name since its already there from the constructor
               // instead add `name` to constructor??
               ///
               return p
            } else if (propertyDef.PrimitiveType) {
               return {...p, 
                  ...{[`${propertyName}`]:{
                  docString:`/**
                           * @param i 
                           * @see: <${propertyDef.Documentation}>
                           */`,
                  name:firstLower(propertyName),
                  args:[{alias:'i', type: SqualsFile.transformAWSPrims(propertyDef.PrimitiveType)}],
                  body:`this.Properties.${propertyName} = i`,
                  returns: `this`
                  }}
               }
            } else if (propertyDef.PrimitiveItemType) {
               return {...p, 
                  ...{[`${propertyName}`]:{
                  docString:`/**
                  * @param i - ${SqualsFile.transformAWSPrims(propertyDef.PrimitiveItemType)}[]
                  * @see: <${propertyDef.Documentation}>
                  */`,
                  name:firstLower(propertyName),
                  args:[{alias:'i', type: SqualsFile.transformAWSPrims(propertyDef.PrimitiveItemType, true)}],
                  body:`this.Properties.${propertyName} = i`,
                  returns: `this`
                  }}
               }
            } else if(propertyDef.Type && propertyDef.Type==='List'){
               return {...p, 
                  ...{[`${propertyName}`]:{
                  docString:`/**
                  * @param i object[]
                  * @see <${propertyDef.Documentation}>
                  */`,
                  name:firstLower(propertyName),
                  args:[{alias:'i', type: `object[]`}],
                  body:`this.Properties.${propertyName} = i`,
                  returns: `this`
                  }
               }
            }
            } else {
               return {...p, 
                  ...{[`${propertyName}`]:{
                  docString:`/**
                  * @param i object
                  * @see <${propertyDef.Documentation}>
                  */`,
                  name:firstLower(propertyName),
                  args:[{alias:'i', type: `object`}],
                  body:`this.Properties.${propertyName} = i`,
                  returns: `this`
                  }
               }
            }
            }
         }
         ,{} as Imethods 
      )

      let getAttMethods: Imethods = {}
      if ( 'Attributes' in resourceMap[awsType] && resourceMap[awsType].Attributes) {
         const attrDef = resourceMap[awsType].Attributes as IAWSAttrs
         getAttMethods = Object.keys(attrDef).reduce(
            (p: Imethods, AttrName: string) => {
               return {
                  ...{[`${AttrName}`]:{
                     name: AttrName,
                     returns: `{'Fn::GetAtt':[this.name, '${AttrName}']} `
                  }},
                  ...p
               }
            },
            {} as Imethods
         )          
      }

      return {...propertyMethods, ...getAttMethods}
   }

   /**
    *
    * @param awsResType  - eg:: `AWS::ElasticBeanstalk::ConfigurationTemplate`
    * @param lookUp - eg:: `AWS::AppSync::DataSource` or `AWS::AppSync::DataSource.HttpConfig`
    * @param lookIn - "resource" | "property",
    * @param resourceMap resource section of part of the giant AWS Cfm Def file
    * @param propertyMap property section of part of the giant AWS Cfm Def file
    */
   __interfaces(
      awsResType: string,
      lookUp: string,
      lookIn: "resource" | "property",
      resourceMap: { [s: string]: IAWSCfmDefs },
      propertyMap: { [s: string]: IAWSCfmDefs }
   ): object {
   
      const myMap = lookIn === "resource" ? resourceMap : propertyMap
   
      
      
      // Section: Prefilter Dirty Data 
      // Because the data has inconsistencies
      // 
      // prefilter out the offending data parts
      // can be deleted when this code returns nothing
      // $> curl https://d1uauaxba7bl26.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json --compressed -o - | jq ' [ .PropertyTypes | to_entries[] ] | map( select( .value | has( "Properties" )!=true )) | from_entries | keys '
      switch(`${lookIn}__${lookUp}`){
         
         case `property__AWS::AppSync::GraphQLApi.AdditionalAuthenticationProviders`:
            // because this SHOULD be a complex list type 
            // and because the item type does not offend
            //
            // look up the ItemType @line:17464 
            return {
                  [`AdditionalAuthenticationProviders?`]: [
                     this.__interfaces(
                        awsResType,            
                        `${awsResType}.AdditionalAuthenticationProvider`,
                        "property",
                        resourceMap,
                        propertyMap
                     )
                  ]
               }
         
         case 'property__AWS::AppSync::GraphQLApi.Tags':
            // because this SHOULD be a complex list type 
            // @line:3990
            return { [`Tags?`]: [{Key:'string', Value:'string'}]}
         
         case 'property__AWS::CodeBuild::Project.FilterGroup':
            // look up the ItemType 
            // @line:17189
            return {
                  [`FilterGroup?`]: [
                     this.__interfaces(
                        awsResType,
                        `${awsResType}.WebhookFilter`,
                        "property",
                        resourceMap,
                        propertyMap
                     )
                  ]
               }
         
         case 'property__AWS::EC2::LaunchTemplate.CapacityReservationPreference':
            // @line 3802
            return {[`CapacityReservationPreference?`]: 'string'}
         
         case 'property__AWS::EC2::LaunchTemplate.CapacityReservationPreference' :
            // @line:19183
            return {
                  [`S3Encryptions?`]: [
                     this.__interfaces(
                        awsResType,            
                        `${awsResType}.S3Encryption`,
                        "property",
                        resourceMap,
                        propertyMap
                     )
                  ]
               }

         case 'property__AWS::Transfer::User.SshPublicKey':
            // @line:8398
            return {'SshPublicKey?': 'string'}
      }
      

      const properties = myMap[lookUp].Properties
      const ret = Object.entries(properties).reduce(
         (prior, [propName, propDef]) => {
            // 'Tags' is a primitive shape
            // because `AppSync.GraphQLApi.Tags` does not have a Property key
            if(propName ==='Tags' && lookIn==='resource'){
               return {
                  ...prior,
                  [`${propName}${propDef.Required ? "" : "?"}`]: [
                     { Key: "string", Value: "string" }
                  ]
               }
            }
            else if ("PrimitiveType" in propDef || "PrimitiveItemType" in propDef) {
               // base case for primitives and primitives[]
               return {
                  ...prior,
                  [`${propName}${
                     propDef.Required ? "" : "?"
                  }`]: SqualsFile.transformAWSPrims(
                     propDef.PrimitiveItemType || propDef.PrimitiveType,
                     propDef.Type === "List"
                  )
               }
            } 
            else if (propDef.ItemType) {
               //special case for Tag List - short-circuit the noncoformist lookup
               if (propDef.ItemType === "Tag") {
                  return {
                     ...prior,
                     [`${propName}${propDef.Required ? "" : "?"}`]: [
                        { Key: "string", Value: "string" }
                     ]
                  }
               } else {
                  // regular ItemType case which is not TAGs
                  return {
                     ...prior,
                     [`${propName}${propDef.Required ? "" : "?"}`]: [
                        this.__interfaces(
                           awsResType,
                           `${awsResType}.${
                              (propDef as Icomplex_list & IcfmProps_usualSuspects)
                                 .ItemType
                           }`,
                           "property",
                           resourceMap,
                           propertyMap
                        )
                     ]
                  }
               }
            } else {
               // found complex Type -> recurse
               return {
                  ...prior,
                  [`${propName}${
                     propDef.Required ? "" : "?"
                  }`]: this.__interfaces(
                     awsResType,
                     `${awsResType}.${
                        (propDef as Icomplex & IcfmProps_usualSuspects).Type
                     }`,
                     "property",
                     resourceMap,
                     propertyMap
                  )
               }
            }
         },
         {}
      )
      return ret
   }
   
}

// #region interfaces


interface Imethods{
   [methodId:string]:Imethod_Elements
}

interface Imethod_Elements{
   docString?: string
   modifiers?: string[]
   name: string
   args?: {alias:string, type:string}[]
   body?: string
   returns?: string
}

interface IStrToStr {
   [str: string]: string
}
interface IStrToStrOrObject {
   [str: string]: string | object
}

export interface IAWSDefTop {
   ResourceTypes: { [awsType: string]: IAWSCfmDefs }
   PropertyTypes: { [awsTypeProp: string]: IAWSCfmDefs }
   ResourceSpecificationVersion: string
}

type IAWSAttrs =
   | {
        [AttrName: string]: {
           PrimitiveType: IawsPrims
        }
     }
   | {
        [AttrName: string]: {
           PrimitiveItemType: IawsPrims
           Type?: "List"
        }
     }

export interface IAWSCfmDefs {
   Documentation: string
   Properties: IProperty
   Attributes?: IAWSAttrs
}

interface IProperty {
   [propName: string]: IcfmProps
}

interface IcfmProps extends IcfmProps_usualSuspects {
   DuplicatesAllowed?: boolean
   PrimitiveType?: IawsPrims
   PrimitiveItemType?: IawsPrims
   Type?: string // array of | complexType
   ItemType?: string // always complext type
}
interface IcfmProps_usualSuspects {
   Required: boolean
   Documentation: string
   UpdateType: IawsMutable
   DuplicatesAllowed?: boolean
}

type IawsPrims = "String" | "Double" | "Boolean" | "Long"| "Integer" | "Json" | 'Timestamp' | 'Tag'
enum IawsPrimsEnum {
   "String","Double","Boolean","Long","Integer","Json",'Timestamp','Tag'
}
type IawsMutable = "Mutable" | "Immutable" | "Conditional"

// use these for egonomic type coersions

interface IProperty_prim {
   [s: string]: IcfmProps_usualSuspects & Iprim
}
interface IProperty_prim_list {
   [s: string]: IcfmProps_usualSuspects & Iprim_list
}
interface IProperty_complex {
   [s: string]: IcfmProps_usualSuspects & Icomplex
}
interface IProperty_complex_list {
   [s: string]: IcfmProps_usualSuspects & Icomplex_list
}

interface Iprim {
   PrimitiveType: IawsPrims
}
interface Iprim_list {
   Type: "List"
   PrimitiveItemType: IawsPrims
}
interface Icomplex {
   Type: string
}
interface Icomplex_list {
   Type: "List"
   ItemType: string
}

// #endregion interfaces
