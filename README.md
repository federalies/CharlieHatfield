# Charlie Hatfield
> C.Hatfield was not a rain maker. He was a "moisture accelerator"

<!-- 
![banner]()
![badge]()
![badge]()
--> 
[![license](https://img.shields.io/github/license/federalies/CharlieHatfield.svg)](LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> `Charlie Hatfield` is a code-generation project that creates squals file out of thin air (or accelerated via a local file from your disk)

Charlie Hatfield is a command line tool that generates stubbed out typescript classes based on cloudTypeId - so far only AWS types have been implemented yet, but the goal is to create Azure and GCloud class too so that as much as reasonable squals components can be qucikly generated and kept up to data based on dependent interfaces published via the cloud providers.


## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [What's With the Name](#project-name)
- [Contributing](#contributing)
- [License](#license)


## Background

The Squals project is a collection of TypeScript/Javascript es6 classes that create components that can be connected together and exported as a cloudformation template.

## Install

`git clone && cd $_ && npm i`

...npm package coming soon.

## Usage

`npx ts-node src/cli.ts -i src/.config.squals.ts`

## API

### CLI

#### gen

### Config File

### configList

## Project Name

This project owes it name to the great work of Nate DiMeo who makes [The Memory Palace](http://thememorypalace.us/2015/07/charlie-god-of-rain/) podcast. 

Episode 69 (from 2015) is an ode to the wonder of the steam punked attempts of mere men to make rain drops form in the clouds. Charlie Hatfield was before his time, little did he know that over a century later people would be interested in sewing their own clouds together in hopes of "making it rain" (but dollars, not dew drops)

## Contributing

See [the contributing file](CONTRIBUTING.md)

PRs accepted.

> Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.


## License

[MIT © Eric Moore.](../LICENSE)
