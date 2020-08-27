[![Build and test](https://github.com/powerbi-cli/powerbi-cli/workflows/Build%20and%20test/badge.svg?branch=live)](https://github.com/powerbi-cli/powerbi-cli/actions?query=workflow%3A%22Build+and+test%22+branch%3Alive)

# Power BI CLI

Home of the Power BI CLI, a multiplatform CLI (command line interface) for interacting with the Power BI REST APIs written in NodeJS.

## Prerequisits

-   NodeJS > v10.12.0, LTS release advised: [download](https://nodejs.org).
-   [Optional] Azure CLI v2+ for easier login [installation](docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

## Installing

Open a cmd/bash/powershell prompt and type to install the `powerbi-cli`:

`npm i -g @powerbi-cli/powerbi-cli`

## Usage

To use the `powerbi-cli` type

`pbicli [command] [options]`

To login to the Power BI REST API use:

`pbicli login [options]`

Recommended login is leverage the `Azure CLI` login flow via:

-   `az login`
-   `pbicli login --azurecli`

For all available commands and options:

`pbicli --help`

For more information see [documentation](https://powerbi-cli.github.io/)

## Contributing

There are many ways in which you can participate in the project, for example:

-   [Submit bugs and feature requests](https://github.com/powerbi-cli/powerbi-cli/issues), and help us verify as they are checked in
-   Review [source code changes](https://github.com/powerbi-cli/powerbi-cli/pulls)
-   Review the [documentation](https://powerbi-cli.github.io/) and make pull requests for anything from typos to new content

If you are interested in fixing issues and contributing directly to the code base, please see the document [How to Contribute]()[Under development].
