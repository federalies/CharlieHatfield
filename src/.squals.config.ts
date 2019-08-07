/**
 * Local Default vars
 */
const outputPathPrefix = './'

/**
 * Default Export
 */
export default {
  configList: [
    {
      typesPrefix: [
        'AWS::AppSync::',
        // 'AWS::Amplify::',
        'AWS::ApiGateway::',
        // 'AWS::ApiGatewayV2',
        // 'AWS::Athena::',
        // 'AWS::Budgets::Budget',
        // 'AWS::CertificateManager::',
        // 'AWS::CloudFormation::',
        // 'AWS::CloudFront::',
        // 'AWS::CodeBuild::',
        // 'AWS::Cognito::',
        // 'AWS::CodeCommit::',
        // 'AWS::CodeDeploy::',
        // 'AWS::CodePipeline::',
        // 'AWS::DynamoDB::',
        'AWS::Lambda::',
        // 'AWS::KinesisFirehose::',
        // 'AWS::Route53::',
        'AWS::S3::'
        // 'AWS::SES::',
        // 'AWS::SNS::',
        // 'AWS::SQS::'
      ]
    }
  ]
} as ISqualsDeaultExport

// #region interfaces

export interface ISqualsDeaultExport {
  outpath?: string
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
  typesPrefix: string[]
}

// #endregion interfaces
