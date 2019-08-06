# Charles Hatfield

> Charlie Hatfield is a maker of clouds (well... at least cloud components)

![banner](./assets/bannerPicExport.jpg)

[![license](https://img.shields.io/github/license/federalies/CharlieHatfield.svg)](LICENSE) [![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme) <!-- ![badge]() ![badge]() -->

> Charlie Hatfield is a code-generation project that creates [squals files](//github.com/federalies/squals) out of thin air, and rains them down on your file system.

## Charlie Hatfield

`Charlie Hatfield` is a command line tool that generates typescript [squals](//github.com/federalies/squals) classes based on published data from various cloud providers. (So far only AWS codeGeneration has been implemented; however, the goal is to create Azure and GCloud versions too) As much as reasonable, Charlie Hatfiel aims to help users stay up-to-date with squals files for new cloud primatives and also be kept up-to-date based on the interfaces published via the cloud providers that we are dependent on.

`Charlie Hatfield` exists because there are so many cloud components available from AWS alone, the idea of making them "by hand" while albeit the hipster artisan way, sends shivers down my back. Can you imagine trying to keep up with the breakneck pace of new stuff from every cloud provider? `C.Hatfield` is the magical method of keeping up with the cloud providers.

## Squals: A Sister Project

_What are `squals files`?_

[Squals](//github.com/federalies/squals) is a sister project that aims to make it easy to discuss cloud components, and to deploy whole use-cases and normalize a multi-cloud deployment into "cloudformation templates" + `Google Cloud Templates`, and `Azure Deployment Template`. [Squals](//github.com/federalies/squals) exists because the idea of declarative cloud deployments is amazing until you realize "declaring dependencies" and "inter-connections" in yaml or json is well...not amazing.

After all it looks a lot like regular (imperative) programing. Squals embracces that idea with a warm hug.

## A Story Together

`Squals` and `Charlie Hatfield` work well under the story of Charles Hatfield anyway. He never claimed to be be able to make rain from nothing, but when a cloud already existed - he could get it to do his bidding. In the world of The Federalies, C. Hatfield is the machine that makes the machine.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [What's With the Name](#project-name)
- [Contributing](#contributing)
- [License](#license)

## Background

The [Squals](//github.com/federalies/squals) project is a collection of TypeScript/Javascript es6 classes that create cloud components which can be connected together and exported as a cloudformation template. If you have ever looked at a Cloudformation Templates the contains things like `Fn:GetAtt` and `Ref:` and `Fn:Join` - these intrinsic functions exist so that the declared template can make internal references and in so doing, avoid repeating large parts of your template.

## Install

```bash
git clone https://github.com/federalies/CharlieHatfield.git 
cd $_
npm i
```

...npm package coming soon.

## Usage

`npx ts-node src/cli.ts -i src/.config.squals.ts`

## Command Line API

### help

`-h, --help` : output usage information

### version

`-V` `--version` : output the version number

### input

`-i, --input [value]` : Input File Names

- the list should be space separated
- example: `input1.js input2.js`
- default Value : `./.squals.config.ts`

### outputDirectory

`-od, --outputDirectory <value>`: Place the folder of generated code here.

- Defaults Value `codeGen`

## Config File(s) Input

C.Hatfield takes in multiple config files. This allows the user to compose configs together in metaFiles and via the command line.

For example: you can pass in file location strings on the command line via `-i` flag and via `stdin`

1. example: `npx ts-node cli.ts` // automatically looks for default config location in the folder its execiuted from `./.squals.config.ts`
2. example: `npx ts-node cli.ts -i core.ts specific1.ts specific3.ts` // is the same as #3
3. example: `cat core.ts | npx ts-node cli.ts -i specific1.ts specific3.ts` // is the same as #2
4. example: `npx ts-node src/cli.ts -i ./src/.squals.config.ts` // basically the same as #1
5. example: `cat utils/fileList.txt | npx ts-node src/cli.ts` // fileList.txt has a line of text with a space separated list of input files.
6. example: `npx ts-node cli.ts < utils/fileList.txt` // use unix pipes to pass info or use the file redirection
7. example: `echo './src/config.ts ./src/config.ts ./src/config.ts' | npx ts-node src/cli.ts -i ./src/config.ts` // or construct some other comamnd that might output file locations

### The Config File

Each file location string given to the CLI will be imported from the file system. The Cli only imports the `deafult` export.

The default export should be an object with keys of `configList` and optionaly `outpath` conforming to theo `interface ISqualsDeaultExport`

Within the exported object, the `configList` is an array that holds either `strings` or objects. There are two types of objects allowed in the the configList Array `ISqualsElements` and `ISqualsShortHand` entries. An ISqualsElements entry lists the awsType and as many other attributes as desired to fully customize some exported code. A `ISqualsShortHand` accepts the defaults and specificies a plethora of types with minimal input.

But is there a happy medium - of minimal input and some customization?

Why Yes! Yes, there is. `ISqualsShortHand` entries can be a list of simple strings (minimalist) `{ typesPrefix: ['AWS::AppSync::', 'etc'] },` OR it can be an object where the key of the object is conceptually equal to the plain string mentioned before (something like `AWS::Lambda::Function`) and the value of the object is some configuration overrides for that type. Currently `path` is the supported override.

So a verbose `configList` examples might be as folllows:

```typescript
export default {
  configList: [
    { awsType: 'AWS::CodeBuild::'
      className: 'CodeBuilder'
      file: 'myCodeBuilder.ts'
      path: '/codebuilder'}, // verbose element entry
    { typesPrefix: [{ 'AWS::Lambda::': { path: '/lambdafunc' } }] } // medium Type list with few overrides
    { typesPrefix: ['AWS::AppSync::', "AWS::CloudFront::"] }, // minimal Type list
  ]
} as ISqualsDeaultExport
```

```typescript
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
```

## Project Name

This project owes it name to the great work of Nate DiMeo who makes [The Memory Palace](http://thememorypalace.us?referredby=thefederalies) podcast.

[Episode 69 (from 2015)](http://thememorypalace.us/2015/07/charlie-god-of-rain?referredby=thefederalies) is an ode to the wonder of the steam punked attempts of mere men to make rain drops form in the clouds and fall to the ground. Charlie Hatfield was before his time, little did he know that over a century later people would be interested in sewing their own clouds together in hopes of "making it rain" (only in dollars, not dew drops)

## Contributing

See [the contributing file](CONTRIBUTING.md)

PRs accepted.

> Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT © Eric Moore.](../LICENSE)
