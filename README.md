## Build status

| Branch  | status                                                                                                                                                                                                                           |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Develop | [![Build and test](https://github.com/powerbi-cli/powerbi-cli/workflows/Build%20and%20test/badge.svg?branch=develop)](https://github.com/powerbi-cli/powerbi-cli/actions?query=workflow%3A%22Build+and+test%22+branch%3Adevelop) |
| Live    | [![Build and test](https://github.com/powerbi-cli/powerbi-cli/workflows/Build%20and%20test/badge.svg?branch=live)](https://github.com/powerbi-cli/powerbi-cli/actions?query=workflow%3A%22Build+and+test%22+branch%3Alive)       |

# Power BI CLI

Home of the Power BI CLI, a multiplatform CLI (command line interface) for interacting with the Power BI REST APIs written in NodeJS.

## Prerequisits

-   NodeJS > v10.12.0, LTS release advised: [download](https://nodejs.org).

## Installing

Open a cmd/bash/powershell prompt and type to install the `powerbi-cli`:

`npm i -g @powerbi-cli/powerbi-cli`

To install a preview version use the following command:

`npm i -g @powerbi-cli/powerbi-cli@preview`

## Usage

To use the `powerbi-cli` type

`pbicli [command] [options]`

To login to the Power BI REST API use:

`pbicli login`

For all available commands and options:

`pbicli --help`

For more information see [documentation](https://powerbi-cli.github.io/)

## Power BI Rest API coverage

_Last update: July 19, 2022_

| PBICLI Command    | Coverage report                |
| ----------------- | ------------------------------ |
| admin             | [link](./src/admin/api.md)     |
| app               | [link](./src/app/api.md)       |
| capacity          | [link](./src/capacity/api.md)  |
| dashboard         | [link](./src/dashboard/api.md) |
| dataflow          | [link](./src/dataflow/api.md)  |
| dataset           | [link](./src/dataset/api.md)   |
| feature           | [link](./src/feature/api.md)   |
| gateway           | [link](./src/gateway/api.md)   |
| import            | [link](./src/import/api.md)    |
| pipeline          | [link](./src/pipeline/api.md)  |
| profile           | -                              |
| push              | -                              |
| report            | [link](./src/report/api.md)    |
| scorecard         | [link](./src/scorecard/api.md) |
| template          | -                              |
| workspace (group) | [link](./src/group/api.md)     |
| user              | [link](./src/user/api.md)      |

## Contributing

There are many ways in which you can participate in the project, for example:

-   [Ask questions and share ideas](https://github.com/powerbi-cli/powerbi-cli/discussions) via the discussions section
-   [Submit bugs and feature requests](https://github.com/powerbi-cli/powerbi-cli/issues), and help us verify as they are checked in
-   Review [source code changes](https://github.com/powerbi-cli/powerbi-cli/pulls)
-   Review the [documentation](https://powerbi-cli.github.io/) and make pull requests for anything from typos to new content

If you are interested in fixing issues and contributing directly to the code base, please see the document [How to Contribute]()[Under development].
