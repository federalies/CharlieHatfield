Prove SES is missing

1. Missing `SES` Definitions

  - `cat data/cloudformation_20190731.awsformat.json | jq ' [ .PropertyTypes | to_entries[] ] | map( select( .key | startswith( "AWS::SES" ) ))'`
  - result = []

2. 6 elements are missing `Properties` key

  - `cat data/cloudformation_20190731.awsformat.json | jq ' [ .PropertyTypes | to_entries[] ] | map( select( .value | has( "Properties" )!=true ))'`

3. AWS::Amplify::??

  - `cat data/cloudformation_20190731.awsformat.json | jq ' [ .PropertyTypes | to_entries[] ] | map( select( .key | startswith( "AWS::Amplify" ) ))'`

4. Is this one particulalry bad?

  - `https://d68hl49wbnanq.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json`

  `curl https://d68hl49wbnanq.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json --compressed -o - | jq ' [ .PropertyTypes | to_entries[] ] | map( select( .value | has( "Properties" )!=true ))'`
