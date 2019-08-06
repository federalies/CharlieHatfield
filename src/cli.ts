#! ts-node cli.ts
//
// @see prgram.usage for examples on how to run the cli.
// Maybe merge te Make Component and Make Validator
// maybe use the command pattern when that happens

import { SqualsFile } from './sourceFile'
import fs from 'fs'
import path from 'path'
import getStdin from 'get-stdin'
import program from 'commander'

// import awsDefs from '../data/cloudformation_20190731.awsformat.json'
const fsPromises = fs.promises

  /**
   * @description main IIFF
   * @params inputs from cli
   */
;(async (CLIinput: string[]) => {
  // #region commander helpers

  /**
   * @description no need for lodash yet
   * @param i
   */
  const flatten = <T>(i: T[][]): T[] => {
    return i.reduce(
      (p, c) => {
        return [...p, ...c]
      },
      [] as T[]
    )
  }

  /**
   * @description side effect printer
   * @param d
   */
  const _p = <T>(d: T) => {
    console.log(`printer:: ${d}`)
    return d
  }

  const isAllCaps = (s: string) => {
    return [...s].every(v => v === v.toUpperCase())
  }

  /**
   * @description reducer for commander
   * @param val
   * @param acc
   */
  const collect = (val: string, acc: string[]) => {
    acc.push(val)
    return _p(acc)
  }

  /**
   * @description trim up strings so that they dont start or end with / or start with
   * @param s
   * ```javascript
   * console.log(trimPathstoToken('../../federalies/')) // federalies
   * console.log(trimPathstoToken('./././federalies..///')) // federalies
   * ```
   */
  const trimPathsToToken = (s: string): string => {
    if (s.startsWith('.')) {
      return trimPathsToToken(s.slice(1))
    } else if (s.startsWith('/')) {
      return trimPathsToToken(s.slice(1))
    }
    // other unrelated case
    if (s.endsWith('/')) {
      return trimPathsToToken(s.slice(0, -1))
    }
    if (s.endsWith('.')) {
      return trimPathsToToken(s.slice(0, -1))
    }
    return s
  }

  /**
   * @description idempotent fs mkDir function
   * @param pathString
   * @requires path module
   */
  const declarePath = async (pathString: string): Promise<fs.Stats> => {
    const ensurePath = path.parse(pathString).dir
    // console.log({ ensurePath })
    let _stat: fs.Stats
    try {
      _stat = await fsPromises.lstat(ensurePath)
      if (_stat && !_stat.isDirectory) {
        await fsPromises.mkdir(ensurePath, { recursive: true })
      }
      return _stat
    } catch (er) {
      await fsPromises.mkdir(ensurePath, { recursive: true })
      _stat = await fsPromises.lstat(ensurePath)
      return _stat
    }
  }

  const firstLower = (s: string) => {
    return `${s[0].toLowerCase()}${s.slice(1)}`
  }

  // #endregion commander helpers
  program
    .version('0.1.0')
    .usage(
      `

Example Executions Include:

npx ts-node src/cli.ts -i ./src/.squals.config.ts
npx ts-node cli.ts
npx ts-node cli.ts -i .squals.config.ts
cat utils/fileList.txt | npx ts-node src/cli.ts
npx ts-node cli.ts < utils/fileList.txt
echo './src/config.ts ./src/config.ts ./src/config.ts' | npx ts-node src/cli.ts -i ./src/config.ts`
    )
    .option(
      '-i, --input [value]',
      'Input File Names (space separated) {{ eg = input1.js input2.js }} - defaults to: config.ts',
      collect,
      []
    )
    .option(
      '-od, --outputDirectory <value>',
      'Place the folder of generated code here. - Defaults to: `codeGen`',
      'codeGen'
    )
    .parse(CLIinput)

  // correctly type the comander program.input
  const programInput = program.input as string[]
  const fromPipe: string[] = (await getStdin()).trimRight().split(' ')
  let configFileStrings: string[] = programInput.concat(fromPipe).filter(v => v)

  // set the default in case nothing was passed in
  configFileStrings =
    configFileStrings.length > 0
      ? configFileStrings
      : [path.resolve(process.cwd(), './.squals.config.ts')]

  const importedConfigFilesData = await Promise.all(
    configFileStrings.map((fileName: string) => {
      return import(path.resolve(process.cwd(), `${fileName}`))
    })
  ).catch((er: any) => console.error(er))

  console.log({ configFileStrings })

  if (importedConfigFilesData) {
    const importedConfigs = (importedConfigFilesData as any[]).map(
      fileData => (fileData as { [str: string]: any }).default
    )

    const processType = (s: string) => {
      const parts = s.split('::')
      if (parts.length === 3) {
        return [parts[0], parts[1], parts[2]] as [string, string, string]
      } else {
        console.error(`careful, did not find all three parts `)
        throw new Error(
          `make sure you give a correct AwS formatted CFM type eg: 'AWS::Lambda::Function'\n` +
            `Found this instead ${s}`
        )
      }
    }

    const awsDefs = await import('../data/cloudformation_20190731.awsformat.json').catch(er => {
      const w = console.warn
      w(`Attempted to use a local copy of data folder with a cfm definition file in it.`)
      w(`Since it was not found will attempt to pull one dowm from the network.`)
      w(`looked for : '../data/cloudformation_20190731.awsformat.json'`)
    })

    console.log(Object.keys(awsDefs as {}))

    if (awsDefs && 'default' in awsDefs) {
      await SqualsFile.fromAwsCfmDef(awsDefs.default).catch((er: any) => console.error(er))
    } else {
      console.log({ awsDefs })
      console.log('Likley going to make network call')
      await SqualsFile.fromAwsCfmDef(awsDefs).catch((er: any) => console.error(er))
    }

    // console.log({ definFile: SqualsFile.awsDefinitionFile })

    // @todo normalize the importedConfgs
    // how to handle inputs wher varried levels of specificity?
    // Example:
    // configList: [
    //      {
    //        awsType: 'AWS::Lambda::Alias', // required
    //        className: 'LambdaAlias',
    //        file: 'alias.ts'
    //      },{
    //        awsTypesPrefix: ['AWS::Lambda::']
    //      }
    //

    const ret = (importedConfigs as ISqualsConfig[]).map(config => {
      config.configList.map(async squalsCfgEntry => {
        if ('typeId' in squalsCfgEntry) {
          const [, _service, _object]: [string, string, string] = processType(squalsCfgEntry.typeId)
          const _path = squalsCfgEntry.path
            ? trimPathsToToken(squalsCfgEntry.path)
            : `${_service.toLowerCase()}`

          const _file = squalsCfgEntry.file
            ? trimPathsToToken(squalsCfgEntry.file)
            : `${_object.toLowerCase()}`

          const _className = squalsCfgEntry.className
            ? squalsCfgEntry.className
            : `${_service}${_object}`

          // const a = fs.createWriteStream(squalsCfgEntry.awsType)

          const wPath = path.resolve(
            process.cwd(),
            `${program.outputDirectory}`,
            `${_path}`,
            `${_file}`
          )
          const sqFile = await new SqualsFile(
            firstLower(_file),
            _className,
            squalsCfgEntry.typeId
          ).gen()

          await declarePath(path.parse(wPath).dir)
          const fh = await fsPromises.open(wPath, 'w+').catch(er => console.error(er))
          if (fh) {
            await fh
              .writeFile(sqFile.toString(), { encoding: 'utf-8' })
              .catch(er => console.error(er))
            await fh.close()
          }
        } else {
          // prefix list modes
          // this sequence leverages this idea that SqualsFiles no how to pull down their own data
          if (!SqualsFile.awsDefinitionFile) {
            await SqualsFile.fromAwsCfmDef()
          } else {
            const awsDefs = SqualsFile.awsDefinitionFile // @complierHelp
            const sqNestedFiles = (squalsCfgEntry.typesPrefix as any[]).map(
              (prefix: prefixType) => {
                if (typeof prefix === 'string') {
                  // shorthand notation
                  const ret = Object.keys(awsDefs.ResourceTypes)
                    .filter(resType => resType.startsWith(prefix))
                    // multiple matches give multiple
                    .map(resType => {
                      let [, _service, _object] = processType(resType)
                      return new SqualsFile(
                        isAllCaps(_service)
                          ? `${_service}/${firstLower(_object)}.ts`
                          : `${firstLower(_service)}/${firstLower(_object)}.ts`,
                        `${_service}${_object}`,
                        resType
                      )
                    })
                  return ret
                } else {
                  // shorthand + override
                  const awsPrefix = Object.keys(prefix)[0]
                  const ret = Object.keys(awsDefs.ResourceTypes)
                    .filter(resType => resType.startsWith(awsPrefix))
                    // multiple matches give multiple
                    .map(resType => {
                      let [, _service, _object] = processType(resType)
                      return new SqualsFile(
                        isAllCaps(_service)
                          ? `${prefix[awsPrefix].path}/${_service}/${firstLower(_object)}.ts`
                          : `${prefix[awsPrefix].path}/${firstLower(_service)}/${firstLower(
                              _object
                            )}.ts`,
                        `${_service}${_object}`,
                        resType
                      )
                    })
                  return ret
                }
              }
            )

            const sqFiles = await Promise.all(flatten(sqNestedFiles).map(s => s.gen()))
            console.log(sqFiles)

            sqFiles.map(async sqF => {
              const wPath = path.resolve(
                process.cwd(),
                program.outputDirectory,
                trimPathsToToken(sqF.filename)
              )

              await declarePath(_p(wPath))
              const fh = await fsPromises.open(wPath, 'w+').catch(er => {
                console.error(`caught during the fs.open catch block`)
                console.error(er)
              })
              if (fh) {
                await fh.writeFile(sqF.toString(), { encoding: 'utf-8' }).catch(er => {
                  console.error(`caught during the writeFiule catch block`)
                  console.error(er)
                })
                await fh.close()
              }
            })
          }
        }
      })
    })
    return ret
  }
})(process.argv)

// #region interfaces

export interface ISqualsConfig {
  configList: ISqualsConfigList
}

export type ISqualsConfigList = ISqualsConfigItem[]
export type ISqualsConfigItem = ISqualsElements | ISqualsShortHand | ISqualsPrefixConfigList

export interface ISqualsElements {
  typeId: string
  className?: string
  file?: string
  path?: string
}

type prefixType = string | { [prefix: string]: ISqualsPrefixConfig }

export interface ISqualsShortHand {
  typesPrefix: string[]
}

export interface ISqualsPrefixConfigList {
  typesPrefix: [{ [prefix: string]: ISqualsPrefixConfig }]
}

export interface ISqualsPrefixConfig extends Istr2Str {
  path: string
}

interface Istr2Str {
  [other: string]: string
}

// #endregion interfaces
