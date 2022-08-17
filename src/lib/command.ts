/*
 * Copyright (c) 2020 Jan Pieter Posthuma / DataScenarios
 *
 * All rights reserved.
 *
 * MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { Command, CommanderError, Help } from "commander";
import chalk from "chalk";
import jmespath from "jmespath";

import { getFooter } from "./footer";
import { getHeader } from "./header";

import { OutputType } from "./output";
import { currentVersion, getVersions } from "./version";

export const GlobalCommands = ["interactive", "version", "help"];
export const AllGlobalCommands = GlobalCommands.concat(["configure", "login", "logout", "rest"]);
export const GlobalOptions = ["-o", "output-file", "query", "debug", "verbose", "-h"];

export class ModuleCommand extends Command {
    private errorMsg: string | undefined;

    constructor(name: string) {
        super(name);

        this.exitOverride(this.exit);
        this.addHelpCommand("help [command]", "Show help message for [command] and exit");

        this.addCommand(new Command("interactive").description("Start interactive mode"));
        this.configureHelp({
            formatHelp: (helpCommand: Command, helper: Help) => {
                if (this.helpPrompt == "false" || this.errorMsg === "") return "";
                this.helpPrompt = "false";
                const output = [getHeader(this.isInteractive)];
                const isParent = !helpCommand.parent;
                const termWidth = helper.padWidth(helpCommand, helper);
                const helpWidth = helper.helpWidth || 80;
                const itemIndentWidth = 2;
                const itemSeparatorWidth = 2; // between term and description
                function formatItem(term: string, description?: string) {
                    if (description) {
                        const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
                        return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
                    }
                    return term;
                }
                function formatList(textArray: string[]) {
                    return textArray.join("\n").replace(/^/gm, " ".repeat(itemIndentWidth));
                }
                const allCommands = helper
                    .visibleCommands(helpCommand)
                    .filter(
                        (cmd) => !((this.isInteractive || !isParent) && GlobalCommands.some((c) => c === cmd.name()))
                    );
                // Usage
                const usage = helper.commandUsage(helpCommand).split(" ").reverse();
                if (allCommands.length === 0) usage[0] = ""; // No commands, remove command
                if (usage[0] === "command" && usage[1] === "options") [usage[0], usage[1]] = [usage[1], usage[0]]; //Flip last two elements
                output.push(`Usage: ${usage.reverse().join(" ")}`, "");
                // Description
                const commandDescription = helper.commandDescription(helpCommand);
                if (commandDescription.length > 0) {
                    output.push(commandDescription, "");
                }
                // Arguments
                const argumentList = helper.visibleArguments(helpCommand).map((argument) => {
                    return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
                });
                if (argumentList.length > 0) {
                    output.push("Arguments:", formatList(argumentList), "");
                }
                // Commands
                const subGroupList = allCommands
                    .filter((cmd) => !AllGlobalCommands.some((c) => c === cmd.name()))
                    .map((cmd) => {
                        return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
                    });
                if (subGroupList.length > 0) {
                    output.push(isParent ? "Subgroups:" : "Commands:", formatList(subGroupList), "");
                }
                const commandList = allCommands
                    .filter((cmd) => AllGlobalCommands.some((c) => c === cmd.name()))
                    .map((cmd) => {
                        return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
                    });
                if (commandList.length > 0) {
                    output.push("Commands:", formatList(commandList), "");
                }
                // Options
                const optionList = helper
                    .visibleOptions(helpCommand)
                    .filter((option) => !(this.isInteractive && ["-h"].some((o) => o === option.long)))
                    .map((option) => {
                        return formatItem(helper.optionTerm(option), helper.optionDescription(option));
                    });
                if (optionList.length > 0) {
                    output.push("Options:", formatList(optionList), "");
                }
                // Footer
                output.push(getFooter(this.isInteractive));
                return output.join("\n");
            },
        });
        this.exitOverride(this.exit);
    }

    public addGlobalOptions(): void {
        this.addCommand(
            new ModuleCommand("version")
                .description("Show the version of this Power BI CLI")
                .action(() => this.showVersion())
        );
        this.option("--output -o [output]", "Output format. Allowed values: json, tsv, yml. Default: json")
            .option("--output-file <file>", "Save response payload to a file")
            .option("--query <query>", "JMESPath query string")
            .option("--debug", "Increase logging verbosity to show debug logs")
            .option("--verbose", "Increase logging verbosity to show all logs")
            .option("--help -h", "Show this help message and exit")
            .on("option:-h", () => this.outputHelp())
            .on("option:-o", (value: string | null) => {
                this.outputFormat = this.validateOutput(value);
                if (this.outputFormat === OutputType.unknown) {
                    this.errorMsg = `error: unknown output value '${value}'`;
                    this.showHelpOrError(false);
                    this.exit(new CommanderError(1, "pbicli.unknownOutputValue", this.errorMsg));
                }
            })
            .on("option:output-file", (value: string) => {
                this.outputFile = value;
            })
            .on("option:query", (value: string) => {
                this.jmsePath = value;
            })
            .on("option:debug", () => (process.env.DEBUG = "true"))
            .on("option:verbose", () => (process.env.VERBOSE = "true"))
            .on("command:*", (operands) => {
                this.showUnknownCommand(operands[0]);
            });
    }

    public showHelpOrError(skipHelp = true): void {
        if (this.isInteractive || skipHelp) {
            const errors = this.errorMsg?.toString().split("\n");
            errors?.forEach((error: string, index: number) => console.error(index === 0 ? chalk.red(error) : error));
        } else {
            this.outputHelp();
        }
        this.errorMsg = undefined;
    }

    public async showVersion(): Promise<void> {
        const versions = await getVersions();
        if (this.jmsePath) {
            try {
                const output = jmespath.search(versions, this.jmsePath);
                console.info(output);
            } catch (err) {
                console.error(chalk.red(`pbicli version: error: argument --query: ${err}`));
            }
        } else {
            console.info(JSON.stringify(versions, null, " "));
        }
        this.exit(new CommanderError(0, "pbicli.version", currentVersion));
    }

    public showCurrentError(): void {
        if (this.errorMsg) console.error(chalk.red(this.errorMsg));
    }

    public exit(error: CommanderError): void {
        if (!this.isInteractive) process.exit(error.exitCode);
    }

    public unknownCommand(): void {
        const operand = this.args[0];
        if (operand === "") return;
    }

    private showUnknownOption(operand: string): void {
        const args = this.getAllArgs(this as ModuleCommand);
        const extraCmd = args.slice(0, args.indexOf(operand)).join(" ");
        this.errorMsg = `error: unknown option '${operand}'.\n\nTry run 'pbicli ${extraCmd} --help' for more information`;
        this.showHelpOrError(true);
        this.exit(new CommanderError(1, "pbicli.unknownOption", this.errorMsg));
    }

    private showUnknownCommand(operand: string): void {
        const args = this.getAllArgs(this as ModuleCommand);
        const extraCmd = args.slice(0, args.indexOf(operand)).join(" ");
        this.errorMsg = `error: unknown command '${operand}'.\n\nTry run 'pbicli ${extraCmd} --help' for more information`;
        this.showHelpOrError(true);
        this.exit(new CommanderError(1, "pbicli.unknownCommand", this.errorMsg));
    }

    private getAllArgs(command: ModuleCommand): string[] {
        if (!command.parent) {
            return command.args;
        } else {
            return this.getAllArgs(command.parent as ModuleCommand);
        }
    }

    public set helpPrompt(value: string | undefined) {
        process.env.PBICLI_helpPrompt = value;
    }

    public get helpPrompt(): string | undefined {
        return process.env.PBICLI_helpPrompt as string | undefined;
    }

    public set outputFormat(value: OutputType | undefined) {
        process.env.PBICLI_outputFormat = value;
    }

    public get outputFormat(): OutputType | undefined {
        return process.env.PBICLI_outputFormat as OutputType | undefined;
    }

    public set outputFile(value: string | undefined) {
        process.env.PBICLI_outputFile = value;
    }

    public get outputFile(): string | undefined {
        return process.env.PBICLI_outputFile as string | undefined;
    }

    public set jmsePath(value: string | undefined) {
        process.env.PBICLI_jmsePath = value;
    }

    public get jmsePath(): string | undefined {
        return process.env.PBICLI_jmsePath as string | undefined;
    }

    public get isInteractive(): boolean {
        return process.env.PBICLI_interactive === "true";
    }

    public set errorMessage(value: string | undefined) {
        this.errorMsg = value;
    }

    private validateOutput(value: string | null): OutputType {
        switch (value) {
            case null:
            case "json":
                return OutputType.json;
            case "tsv":
                return OutputType.tsv;
            case "csv":
                return OutputType.csv;
            case "yml":
                return OutputType.yml;
            case "none":
                return OutputType.none;
        }
        return OutputType.unknown;
    }
}
