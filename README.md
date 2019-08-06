# Charles Hatfield

<!-- 
![banner]()
![badge]()
![badge]()
--> 
> Charlie Hatfield is a maker of clouds (well... at least cloud components)

[![license](https://img.shields.io/github/license/federalies/CharlieHatfield.svg)](LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)


> Charlie Hatfield is a code-generation project that creates [squals files](//github.com/federalies/squals) out of thin air, and rains them down on your file system.

### Charlie Hatfield
`Charlie Hatfield` is a command line tool that generates stubbed out typescript [squals](//github.com/federalies/squals) classes based on published `cloudTypeId`s (so far only AWS types have been implemented - however the goal is to create Azure and GCloud verssions too) so that, as much as reasonable, squals components can be qucikly generated for new cloud primatives and also  be kept up-to-date based on the interfaces published via the cloud providers that we are dependent on.

`Charlie Hatfield` exists because there are so many components available from AWS alone, the idea of making them by hand sends shivers down my back. Can you imagine trying to keep up with the breakneck pace of new stuff from every cloud provider? `C.Hatfield` is the magical method of keeping up with the cloud providers.

### Squals: A Sister Project
What are `squals files`? squals is a sister project that aims to create componentize cloud use cases and normalizies the deployment into a cloudformation template. [Squals](//github.com/federalies/squals) exists because the idea of declarative cloud deployments is amazing until you realize "declaring dependecnies" and "interconnections" in yaml is well...not amazing. After all it looks a lot like regular (imperative) programing.

### A Story Together

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
