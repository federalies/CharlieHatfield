import { IAWSCfmDefs, SqualsFile, IAWSDefTop } from '../src/sourceFile'
import awsCfmDefs from '../data/cloudformation_20190809.awsformat.json'
import PATCH from '../data/cloudformation_20190809.patch'
// import lodash from "lodash";

const merged = {
  PropertyTypes: { ...awsCfmDefs.PropertyTypes, ...PATCH.PropertyTypes },
  ResourceTypes: { ...awsCfmDefs.ResourceTypes, ...PATCH.ResourceTypes },
  ResourceSpecificationVersion: PATCH.ResourceSpecificationVersion
}

describe('SqualFileClass ', () => {
  let lambdaFile = new SqualsFile('lambda.ts', 'LambdaFunction', 'AWS::Lambda::Function')

  test('Basic Class Shape', async () => {
    // await SqualsFile.fromAwsCfmDef(merged)
    expect(lambdaFile).toMatchObject({
      filename: 'lambda.ts',
      Class: 'LambdaFunction',
      awsType: 'AWS::Lambda::Function',
      ClassExts: {
        implements: ['squals']
      }
    })
  })

  test('Some Properties that should be there', () => {
    expect(lambdaFile).toHaveProperty('sections._imports')
    expect(lambdaFile).toHaveProperty('sections._methods')
    expect(lambdaFile).toHaveProperty('sections._interfaces')
    expect(lambdaFile).toHaveProperty('sections._attributes')
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
    await SqualsFile.fromAwsCfmDef(merged)
    const s = await lambdaFile.genInterfaces()

    expect(s.sections._interfaces._min.data).toEqual({
      'name?': 'string',
      handler: 'IStrRefGetAtt',
      role: 'IStrRefGetAtt',
      runtime: 'IStrRefGetAtt',
      code: {
        'S3Bucket?': 'IStrRefGetAtt',
        'S3Key?': 'IStrRefGetAtt',
        'S3ObjectVersion?': 'IStrRefGetAtt',
        'ZipFile?': 'IStrRefGetAtt'
      },
      'deadLetterConfig?': {
        'TargetArn?': 'IStrRefGetAtt'
      },
      'description?': 'IStrRefGetAtt',
      'environment?': {
        'Variables?': 'IStrRefGetAtt'
      },
      'functionName?': 'IStrRefGetAtt',
      'kmsKeyArn?': 'IStrRefGetAtt',
      'layers?': 'IStrRefGetAtt[]',
      'memorySize?': 'number',
      'reservedConcurrentExecutions?': 'number',
      'tags?': [
        {
          Key: 'string',
          Value: 'string'
        }
      ],
      'timeout?': 'number',
      'tracingConfig?': {
        'Mode?': 'IStrRefGetAtt'
      },
      'vpcConfig?': {
        SecurityGroupIds: 'IStrRefGetAtt[]',
        SubnetIds: 'IStrRefGetAtt[]'
      }
    })

    expect(s.sections._interfaces._props.data).toEqual({
      Handler: 'IStrRefGetAtt',
      Role: 'IStrRefGetAtt',
      Runtime: 'IStrRefGetAtt',
      Code: {
        'S3Bucket?': 'IStrRefGetAtt',
        'S3Key?': 'IStrRefGetAtt',
        'S3ObjectVersion?': 'IStrRefGetAtt',
        'ZipFile?': 'IStrRefGetAtt'
      },
      'Description?': 'IStrRefGetAtt',
      'FunctionName?': 'IStrRefGetAtt',
      'KmsKeyArn?': 'IStrRefGetAtt',
      'Layers?': 'IStrRefGetAtt[]',
      'MemorySize?': 'number',
      'ReservedConcurrentExecutions?': 'number',
      'Timeout?': 'number',
      'DeadLetterConfig?': {
        'TargetArn?': 'IStrRefGetAtt'
      },
      'Environment?': {
        'Variables?': 'IStrRefGetAtt'
      },
      'TracingConfig?': {
        'Mode?': 'IStrRefGetAtt'
      },
      'VpcConfig?': {
        SecurityGroupIds: 'IStrRefGetAtt[]',
        SubnetIds: 'IStrRefGetAtt[]'
      },
      'Tags?': [
        {
          Key: 'string',
          Value: 'string'
        }
      ]
    })
  })

  test('Methods Gen', async () => {
    await SqualsFile.fromAwsCfmDef(merged)
    const s = await lambdaFile.genMethods()
    expect(s.sections._methods).toMatchObject({
      constructor: {
        name: 'constructor',
        args: [{ alias: 'i', type: `ILambdaFunction_min` }],
        body: `this.name = genComponentName(i.name) \n this.Properties = LambdaFunction.inputTransform(i)`
      },
      fromString: {
        name: 'fromString',
        modifiers: ['static'],
        args: [{ alias: 's', type: 'string' }],
        returnType: `LambdaFunction`,
        returns: `LambdaFunction.validate(JSON.parse(s))`
      },
      fromJSON: {
        name: 'fromJSON',
        modifiers: ['static'],
        args: [{ alias: 'i', type: 'object' }],
        returnType: `LambdaFunction`,
        returns: `LambdaFunction.validateJSON(i as ILambdaFunction_json )`
      },
      fromJS: {
        name: 'fromJS',
        modifiers: ['static'],
        args: [{ alias: 'i', type: 'object' }],
        returnType: `LambdaFunction`,
        returns: ` LambdaFunction.validateJS(i as ILambdaFunction_min )`
      },
      from: {
        name: 'from',
        modifiers: ['static'],
        args: [{ alias: 'i', type: 'string | object' }],
        returnType: `LambdaFunction`,
        returns: ` LambdaFunction.validate(i)`
      },
      inputTransform: {
        name: 'inputTransform',
        modifiers: ['static'],
        args: [{ alias: 'i', type: `ILambdaFunction_min` }],
        returnType: `ILambdaFunction_props`,
        body: `const ret = {} \n // make thge return Objects for this.Properties`,
        returns: `ret`
      },
      _name: {
        name: '_name',
        args: [{ alias: 's', type: 'string' }],
        body: 'this.name = s',
        returnType: `LambdaFunction`,
        returns: `this`
      },
      toJSON: {
        name: 'toJSON',
        returns: ` {[this.name]:{ Type:'AWS::Lambda::Function', Properties: this.Properties }}`
      }
    })
  })

  test.skip('Gen', async () => {
    const sGen = await lambdaFile.gen(merged)
    console.log({ sGen })

    const s = sGen.toString()
    console.log({ s })

    expect(s.length).toBeGreaterThan(100)
  })

  test.skip('Gen2', async () => {
    const appSyncFile = new SqualsFile('appSync.ts', 'AppSyncApi', 'AWS::AppSync::GraphQLApi')
    console.log({ appSyncFile })

    const appSyncFileGend = await appSyncFile.gen(merged)
    console.log({ appSyncFileGend })

    const appSyncFileString = appSyncFileGend.toString()
    console.log({ appSyncFileString })

    expect(appSyncFileString.length).toBeGreaterThan(100)
  })

  test('__interfaces() for GraphQLApi', () => {
    const a = new SqualsFile('file', 'Class', 'AWS::AppSync::GraphQLApi')
    // console.log({'AWS::AppSync::GraphQLApi.Tags': merged.PropertyTypes['AWS::AppSync::GraphQLApi.Tags']})
    const i = a.__interfaces(
      'AWS::AppSync::GraphQLApi',
      'AWS::AppSync::GraphQLApi',
      'resource',
      ((merged as unknown) as IAWSDefTop).ResourceTypes,
      ((merged as unknown) as IAWSDefTop).PropertyTypes
    )
    // console.log(JSON.stringify(i, null, 2))
    expect(i).toMatchObject({
      Name: 'IStrRefGetAtt',
      AuthenticationType: 'IStrRefGetAtt',
      'OpenIDConnectConfig?': {
        'Issuer?': 'IStrRefGetAtt',
        'ClientId?': 'IStrRefGetAtt',
        'AuthTTL?': 'number',
        'IatTTL?': 'number'
      },
      'UserPoolConfig?': {
        'AppIdClientRegex?': 'IStrRefGetAtt',
        'UserPoolId?': 'IStrRefGetAtt',
        'AwsRegion?': 'IStrRefGetAtt',
        'DefaultAction?': 'IStrRefGetAtt'
      },
      'LogConfig?': {
        'CloudWatchLogsRoleArn?': 'IStrRefGetAtt',
        'FieldLogLevel?': 'IStrRefGetAtt'
      },
      'AdditionalAuthenticationProviders?': [
        {
          AuthenticationType: 'IStrRefGetAtt',
          'OpenIDConnectConfig?': {
            'Issuer?': 'IStrRefGetAtt',
            'ClientId?': 'IStrRefGetAtt',
            'AuthTTL?': 'number',
            'IatTTL?': 'number'
          },
          'UserPoolConfig?': {
            'AppIdClientRegex?': 'IStrRefGetAtt',
            'UserPoolId?': 'IStrRefGetAtt',
            'AwsRegion?': 'IStrRefGetAtt'
          }
        }
      ],
      'Tags?': [
        {
          Key: 'string',
          Value: 'string'
        }
      ]
    })
  })

  test('__interfaces() for Lambda', () => {
    const a = new SqualsFile('lambda', 'LambdaFunction', 'AWS::Lambda::Function')
    // console.log({'AWS::AppSync::GraphQLApi.Tags': merged.PropertyTypes['AWS::AppSync::GraphQLApi.Tags']})
    const i = a.__interfaces(
      'AWS::AppSync::GraphQLApi',
      'AWS::AppSync::GraphQLApi',
      'resource',
      ((merged as unknown) as IAWSDefTop).ResourceTypes,
      ((merged as unknown) as IAWSDefTop).PropertyTypes
    )
    // console.log(JSON.stringify(i, null, 2))
    expect(i).toMatchObject({
      Name: 'IStrRefGetAtt',
      AuthenticationType: 'IStrRefGetAtt',
      'OpenIDConnectConfig?': {
        'Issuer?': 'IStrRefGetAtt',
        'ClientId?': 'IStrRefGetAtt',
        'AuthTTL?': 'number',
        'IatTTL?': 'number'
      },
      'UserPoolConfig?': {
        'AppIdClientRegex?': 'IStrRefGetAtt',
        'UserPoolId?': 'IStrRefGetAtt',
        'AwsRegion?': 'IStrRefGetAtt',
        'DefaultAction?': 'IStrRefGetAtt'
      },
      'LogConfig?': {
        'CloudWatchLogsRoleArn?': 'IStrRefGetAtt',
        'FieldLogLevel?': 'IStrRefGetAtt'
      },
      'AdditionalAuthenticationProviders?': [
        {
          AuthenticationType: 'IStrRefGetAtt',
          'OpenIDConnectConfig?': {
            'Issuer?': 'IStrRefGetAtt',
            'ClientId?': 'IStrRefGetAtt',
            'AuthTTL?': 'number',
            'IatTTL?': 'number'
          },
          'UserPoolConfig?': {
            'AppIdClientRegex?': 'IStrRefGetAtt',
            'UserPoolId?': 'IStrRefGetAtt',
            'AwsRegion?': 'IStrRefGetAtt'
          }
        }
      ],
      'Tags?': [
        {
          Key: 'string',
          Value: 'string'
        }
      ]
    })
  })

  test.skip('interface_toString()', () => {
    const a = new SqualsFile('file', 'Class', 'AWS::AppSync::GraphQLApi')
    // console.log({'AWS::AppSync::GraphQLApi.Tags': merged.PropertyTypes['AWS::AppSync::GraphQLApi.Tags']})
    const i = {
      Name: 'IStrRefGetAtt',
      AuthenticationType: 'IStrRefGetAtt',
      'OpenIDConnectConfig?': {
        'Issuer?': 'IStrRefGetAtt',
        'ClientId?': 'IStrRefGetAtt',
        'AuthTTL?': 'number',
        'IatTTL?': 'number'
      },
      'UserPoolConfig?': {
        'AppIdClientRegex?': 'IStrRefGetAtt',
        'UserPoolId?': 'IStrRefGetAtt',
        'AwsRegion?': 'IStrRefGetAtt',
        'DefaultAction?': 'IStrRefGetAtt'
      },
      'LogConfig?': {
        'CloudWatchLogsRoleArn?': 'IStrRefGetAtt',
        'FieldLogLevel?': 'IStrRefGetAtt'
      },
      'Tags?': [
        {
          Key: 'string',
          Value: 'string'
        }
      ]
    }

    a.interface_toSting({ iname: 'IClass_props', data: i })
    expect(i).toMatchObject(i)
  })
})
