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
        'AWS::S3::',
        'AWS::CloudFront::',
        'AWS::Route53::',
        'AWS::AppSync::',
        'AWS::IAM::',
        'AWS::ApiGateway::',
        'AWS::CodeBuild::',
        'AWS::AppSync::',
        'AWS::Lambda::',
        'AWS::CertificateManager::',
        'AWS::CloudFormation::',

        'AWS::Cognito::',
        'AWS::CodePipeline::',
        'AWS::DynamoDB::',
        'AWS::SES::',
        'AWS::SNS::',
        'AWS::SQS::'

        // 'AWS::CodeDeploy::',
        // 'AWS::CodeCommit::',
        // 'AWS::Amplify::',
        // 'AWS::ApiGatewayV2',
        // 'AWS::Athena::',
        // 'AWS::Budgets::Budget',
        // 'AWS::KinesisFirehose::',
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
