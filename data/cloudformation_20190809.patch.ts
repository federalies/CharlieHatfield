/* eslint max-len: ["error", { "ignoreComments": true, "ignoreStrings": true }] */

export default {
  ResourceTypes: {
    // 'AWS::SageMaker::CodeRepository': {
    //   Documentation:
    //     'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html',
    //   Attributes: {
    //     IpAddresses: {
    //       PrimitiveItemType: 'String',
    //       Type: 'List'
    //     }
    //   },
    //   Properties: {
    //     SecurityGroups: {
    //       Documentation:
    //         'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amazonmq-broker.html#cfn-amazonmq-broker-securitygroups',
    //       Required: false,
    //       Type: 'List',
    //       PrimitiveItemType: 'String',
    //       UpdateType: 'Immutable'
    //     },
    //     EngineVersion: {}
    //   }
    // },
    // 'AWS::PinpointEmail::DedicatedIpPool': {
    //   Documentation: 'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/',
    //   Attributes: {},
    //   Properties: {}
    // },
    // 'AWS::EC2::VPCEndpointService': {
    //   Documentation: 'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/',
    //   Attributes: {},
    //   Properties: {}
    // },
    // 'AWS::EC2::VPCEndpointConnectionNotification': {
    //   Documentation: 'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/',
    //   Attributes: {},
    //   Properties: {}
    // },
    'AWS::AppSync::GraphQLApi': {
      Documentation:
        'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html',
      Attributes: {
        GraphQLUrl: {
          PrimitiveType: 'String'
        },
        Arn: {
          PrimitiveType: 'String'
        },
        ApiId: {
          PrimitiveType: 'String'
        }
      },
      Properties: {
        OpenIDConnectConfig: {
          Type: 'OpenIDConnectConfig',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-openidconnectconfig',
          UpdateType: 'Mutable'
        },
        UserPoolConfig: {
          Type: 'UserPoolConfig',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-userpoolconfig',
          UpdateType: 'Mutable'
        },
        Tags: {
          Type: 'Tags',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-tags',
          UpdateType: 'Mutable'
        },
        Name: {
          Required: true,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-name',
          PrimitiveType: 'String',
          UpdateType: 'Mutable'
        },
        AuthenticationType: {
          Required: true,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-authenticationtype',
          PrimitiveType: 'String',
          UpdateType: 'Mutable'
        },
        LogConfig: {
          Type: 'LogConfig',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-logconfig',
          UpdateType: 'Mutable'
        },
        AdditionalAuthenticationProviders: {
          Type: 'List',
          ItemType: 'AdditionalAuthenticationProviders',
          _fixes: ' addresses GraphQLAPi.AdditionalAuthenticationProviders',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-additionalauthenticationproviders',
          UpdateType: 'Mutable'
        }
      }
    },
    'AWS::Transfer::User': {
      Documentation:
        'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html',
      Attributes: {
        ServerId: {
          PrimitiveType: 'String'
        },
        UserName: {
          PrimitiveType: 'String'
        },
        Arn: {
          PrimitiveType: 'String'
        }
      },
      Properties: {
        Policy: {
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-policy',
          PrimitiveType: 'String',
          UpdateType: 'Mutable'
        },
        Role: {
          Required: true,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-role',
          PrimitiveType: 'String',
          UpdateType: 'Mutable'
        },
        HomeDirectory: {
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-homedirectory',
          PrimitiveType: 'String',
          UpdateType: 'Mutable'
        },
        ServerId: {
          Required: true,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-serverid',
          PrimitiveType: 'String',
          UpdateType: 'Immutable'
        },
        UserName: {
          Required: true,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-username',
          PrimitiveType: 'String',
          UpdateType: 'Immutable'
        },
        SshPublicKeys: {
          Type: 'List',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-sshpublickeys',
          ItemType: 'String',
          _fixes: 'Property Type SshPublicKeys Problem',
          UpdateType: 'Mutable'
        },
        Tags: {
          Type: 'List',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-transfer-user.html#cfn-transfer-user-tags',
          ItemType: 'Tag',
          UpdateType: 'Mutable'
        }
      }
    }
  },
  PropertyTypes: {
    // 'AWS::EC2::LaunchTemplate.CapacityReservationPreference': {
    //   Documentation: 'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/',
    //   Attributes: {},
    //   Properties: {}
    // },
    'AWS::AppSync::GraphQLApi.Tags': {
      Documentation:
        'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-tags',
      Properties: {
        Key: {
          Required: true,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configuration-tagsentry.html#cfn-amazonmq-configuration-tagsentry-key',
          PrimitiveType: 'String',
          UpdateType: 'Mutable'
        },
        Value: {
          Required: true,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amazonmq-configuration-tagsentry.html#cfn-amazonmq-configuration-tagsentry-value',
          PrimitiveType: 'String',
          UpdateType: 'Mutable'
        }
      }
    },
    'AWS::CodeBuild::Project.ProjectTriggers': {
      Documentation:
        'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-projecttriggers.html',
      Properties: {
        FilterGroups: {
          Required: false,
          _fixes: 'AWS::CodeBuild::Project.FilterGroup by adding a new Type a Vector:2',
          Type: 'sq:Vector:2',
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-projecttriggers.html#cfn-codebuild-project-projecttriggers-filtergroups',
          ItemType: 'WebhookFilter',
          UpdateType: 'Mutable'
        },
        Webhook: {
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-projecttriggers.html#cfn-codebuild-project-projecttriggers-webhook',
          PrimitiveType: 'Boolean',
          UpdateType: 'Mutable'
        }
      }
    },
    'AWS::Glue::SecurityConfiguration.S3Encryptions': {
      Documentation: 'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/',
      Attributes: {},
      Properties: {}
    },
    'AWS::Glue::SecurityConfiguration.EncryptionConfiguration': {
      Documentation:
        'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html',
      Properties: {
        S3Encryptions: {
          Type: 'List',
          ItemType: 'S3Encryption',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration-s3encryptions',
          UpdateType: 'Mutable'
        },
        CloudWatchEncryption: {
          Type: 'CloudWatchEncryption',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration-cloudwatchencryption',
          UpdateType: 'Mutable'
        },
        JobBookmarksEncryption: {
          Type: 'JobBookmarksEncryption',
          Required: false,
          Documentation:
            'http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-securityconfiguration-encryptionconfiguration.html#cfn-glue-securityconfiguration-encryptionconfiguration-jobbookmarksencryption',
          UpdateType: 'Mutable'
        }
      }
    }
  },
  ResourceSpecificationVersion: '5.0.0'
}
