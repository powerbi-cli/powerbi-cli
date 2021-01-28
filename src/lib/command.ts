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

import { Command, CommanderError, HelpContext } from "commander";
import { red } from "chalk";

import { drawFooter } from "./footer";
import { drawHeader } from "./header";

import { OutputType } from "./output";
import { currentVersion } from "./version";

export class ModuleCommand extends Command {
    private errorMsg: string | undefined;
    private _parent: ModuleCommand | undefined;

    constructor(name: string) {
        super(name);

        this.exitOverride(this.exit);
        this.addHelpCommand("help [command]", "Show help message for [command] and exit");
        //this.addHelpCommand(false);
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
            console.error(red(this.errorMsg));
        } else {
            this.outputHelp();
        }
        this.errorMsg = undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public outputHelp(contextOptions?: unknown): void {
        if (this.helpPrompt == "false" || this.errorMsg === "") return;
        this.helpPrompt = "false";
        drawHeader(this.isInteractive);
        this.showCurrentError();
        let helpLines = this.helpInformation().split("\n");
        if (this.isInteractive) {
            helpLines = helpLines.filter((helpLine: string) => !/help/g.test(helpLine));
            helpLines = helpLines.filter((helpLine: string) => !/version/g.test(helpLine));
            if (!helpLines.some((helpLine: string) => /-/g.test(helpLine)))
                helpLines = helpLines.filter((helpLine: string) => !/Options/g.test(helpLine));
        }
        console.info(helpLines.join("\n"));
        drawFooter(this.isInteractive);
    }

    public async showVersion(): Promise<void> {
        console.info(`pbicli      ${currentVersion}\n`);
        drawFooter(this.isInteractive);
        this.exit(new CommanderError(0, "pbicli.version", currentVersion));
    }

    public showCurrentError(): void {
        if (this.errorMsg) console.error(red(this.errorMsg));
    }

    // Stil need to override _exit() as the base version allways exits the process
    public _exit(exitCode: number, code: string, message: string): void {
        this.exit(new CommanderError(exitCode, code, message));
    }

    public exit(error: CommanderError): void {
        if (!this.isInteractive) process.exit(error.exitCode);
    }

    public unknownOption(flag: string): void {
        //if (super._allowUnknownOption) return;
        if (flag === "--help" || flag === "-h") return;
        this.showUnknownOption(flag);
    }

    public unknownCommand(): void {
        const operand = this.args[0];
        if (operand === "") return;
        this.showUnknownCommand(operand);
    }

    private showUnknownOption(operand: string): void {
        const args = this.getAllArgs(this as ModuleCommand);
        const extraCmd = args.slice(0, args.indexOf(operand)).join(" ");
        this.errorMsg = `error: unknown option '${operand}'. Try run 'pbicli ${extraCmd} --help for more information'`;
        this.showHelpOrError(true);
        this.exit(new CommanderError(1, "pbicli.unknownOption", this.errorMsg));
    }

    private showUnknownCommand(operand: string): void {
        const args = this.getAllArgs(this as ModuleCommand);
        const extraCmd = args.slice(0, args.indexOf(operand)).join(" ");
        this.errorMsg = `error: unknown command '${operand}'. Try run 'pbicli ${extraCmd} --help for more information'`;
        this.showHelpOrError(true);
        this.exit(new CommanderError(1, "pbicli.unknownCommand", this.errorMsg));
    }

    private getAllArgs(command: ModuleCommand): string[] {
        if (!command.parent) {
            return command.args;
        } else {
            return this.getAllArgs(command.parent);
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

    public set parent(value: ModuleCommand | undefined) {
        this._parent = value;
    }

    public get parent(): ModuleCommand | undefined {
        return this._parent;
    }

    private validateOutput(value: string | null): OutputType {
        switch (value) {
            case null:
            case "json":
                return OutputType.json;
            case "tsv":
                return OutputType.tsv;
            case "yml":
                return OutputType.yml;
        }
        return OutputType.unknown;
    }
}
