// /this is a DUMMY FILE
// /this is a DUMMY FILE
// /this is a DUMMY FILE
// /this is a DUMMY FILE
// /this is a DUMMY FILE
// /this is a DUMMY FILE
//
// the real source is at .squals.config.ts

/**
 * Default Export
 */
export default [
  {
    awsType: 'AWS::Lambda::Function',
    classname: 'LambdaFunc',
    file: 'lambda.ts',
    path: 'lambda/'
  },
  {
    awsTypePrefix: 'AWS::Lambda::'
    // implied class == `${Sevice}${Object}`
    // implied file == `${Object.toLowerCase()}.ts`
    // implied path == `/${Object.toLowercase()}`
  },
  {
    file: 'alias.ts',
    classname: 'LambdaAlias',
    awsType: 'AWS::Lambda::Alias'
  },
  {
    file: 'layerVersion.ts',
    classname: 'LambdaLayerVersion',
    awsType: 'AWS::Lambda::Alias',
    methods: {
      '_name()': 'name',
      'other()': 'Properties.Other',
      'lastOne()': 'Properties.LastOne'
    },
    tests: [{}, {}]
  }
]
// KeyTypes =  Array | Object | 'Double' | Function.name
// Arrays w/ 1 element show the example element

export const useSchema = {
  outpath: '../srcGen',
  awsTypes: {
    'AWS::S3::': { path: 's3' },
    'AWS::Lambda::': { path: 'lambda' },
    'AWS::CloudFront::': { path: 'cloudfront' },
    'AWS::Route53::': { path: 'route53' },
    'AWS::CertificateManager::': { path: 'acm' },
    'AWS::IAM::': { path: 'iam' },
    'AWS::CodeBuild::': { path: 'codebuild' },
    'AWS::AppSync::': { path: 'appsync' }
  }
}

// Each Resource gets a file, class, and  Ref()
// Each Resource.Attributes turn into IGetAtt
//
// Each Resource might reference a type floating in the other object collection
//
