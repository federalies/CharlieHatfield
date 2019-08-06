/**
 * Local Default vars
 */
const outputPathPrefix = './'

/**
 * Default Export
 */
export default {
  configList: [
    { typesPrefix: ['AWS::AppSync::'] },
    { typesPrefix: [{ 'AWS::Lambda::': { path: '/lambda' } }] }
  ]
}

// OLD IDEAS
// OLD IDEAS
// OLD IDEAS
export const useSchema = {
  outpath: '../srcGen',
  awsTypes: {
    'AWS::S3::': { path: '/other/s3' },
    'AWS::Lambda::': { path: '/lambda' },
    'AWS::CloudFront::': { path: '/cloudfront' },
    'AWS::Route53::': { path: '/route53' },
    'AWS::CertificateManager::': { path: '/acm' },
    'AWS::IAM::': { path: '/iam' },
    'AWS::CodeBuild::': { path: '/codebuild' },
    'AWS::AppSync::': { path: '/appsync' }
  }
}

// #region interfaces

export interface ISqualsConfig {
  outpath: string
  configList: ISqualsConfigList
}

export type ISqualsConfigList = ISqualsConfigItem[]
export type ISqualsConfigItem = ISqualsElements | ISqualsShortHand

export interface ISqualsElements {
  awsType: string
  className?: string
  file?: string
  path?: string
}

export interface ISqualsShortHand {
  awsTypesPrefix: string[]
}

// #endregion interfaces
