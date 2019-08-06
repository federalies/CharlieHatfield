import { IAWSCfmDefs, SqualsFile, IAWSDefTop } from '../src/sourceFile'
import awsCfmDefs from '../data/cloudformation_20190731.awsformat.json'
// import lodash from "lodash";

describe('SqualFileClass ', () => {
  let lambdaFile = new SqualsFile('lambda.ts', 'LambdaFunction', 'AWS::Lambda::Function')

  test('Default', async () => {
    await SqualsFile.fromAwsCfmDef(awsCfmDefs)
    const a = lambdaFile

    expect(a).toMatchObject({
      filename: 'lambda.ts',
      Class: 'LambdaFunction',
      awsType: 'AWS::Lambda::Function',
      ClassExts: {
        implements: ['squals']
      }
    })
    expect(a).toHaveProperty('sections._imports')
    expect(a).toHaveProperty('sections._methods')
    expect(a).toHaveProperty('sections._interfaces')
    expect(a).toHaveProperty('sections._attributes')
  })

  test('Network based', async () => {
    await SqualsFile.fromAwsCfmDef()
    const a = lambdaFile
    expect(a).toMatchObject({
      filename: 'lambda.ts',
      Class: 'LambdaFunction',
      awsType: 'AWS::Lambda::Function',
      ClassExts: {
        implements: ['squals']
      }
    })
    expect(SqualsFile).toHaveProperty(`awsDefinitionFile.PropertyTypes`)
    expect(SqualsFile).toHaveProperty(`awsDefinitionFile.ResourceTypes`)
    expect((SqualsFile.awsDefinitionFile as any).ResourceTypes).toHaveProperty(a.awsType)
  })

  test('Interface Gen', async () => {
    await SqualsFile.fromAwsCfmDef(awsCfmDefs)
    const s = await lambdaFile.genInterfaces()

    // console.info(s.sections._interfaces._min);
    // console.info(s.sections._interfaces._json);
    // console.info(s.sections._interfaces._props);

    // shortest class name == Tag -> 3
    const shortestPossibleInterfaceStr = 'interface _json { }'.length + 3
    expect(s.sections._interfaces._json.length).toBeGreaterThan(shortestPossibleInterfaceStr)
    expect(s.sections._interfaces._props.length).toBeGreaterThan(shortestPossibleInterfaceStr)
    expect(s.sections._interfaces._min.length).toBeGreaterThan(shortestPossibleInterfaceStr)
  })

  test('Methods Gen', async () => {
    await SqualsFile.fromAwsCfmDef(awsCfmDefs)
    const s = await lambdaFile.genMethods()
    expect(s.sections._methods.length).toBe(28)
  })

  test('Gen', async () => {
    const s = await lambdaFile.gen(awsCfmDefs).then(t => t.toString())
    // console.log(s)
    // @todo what other assertsion can we make?
    expect(s.length).toBeGreaterThan(100)
  })

  test('Pure Func __interfaces', () => {
    const a = new SqualsFile('file', 'Class', 'AWS::AppSync::GraphQLApi')
    // console.log({'AWS::AppSync::GraphQLApi.Tags': awsCfmDefs.PropertyTypes['AWS::AppSync::GraphQLApi.Tags']})
    a.__interfaces(
      'AWS::AppSync::GraphQLApi',
      'AWS::AppSync::GraphQLApi',
      'resource',
      ((awsCfmDefs as unknown) as IAWSDefTop).ResourceTypes,
      ((awsCfmDefs as unknown) as IAWSDefTop).PropertyTypes
    )
  })

  test('Gen2', async () => {
    const appSyncFile = new SqualsFile('appSync.ts', 'AppSyncApi', 'AWS::AppSync::GraphQLApi')
    const appSyncFileString = await appSyncFile.gen().then(t => t.toString())
    // console.log(appSyncFileString)
    expect(appSyncFileString.length).toBeGreaterThan(100)
  })
})
