#!/usr/bin/env node

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

import { join } from "path";
import { homedir } from "os";
import inquirer from "inquirer";
import inquirerCommandPrompt from "inquirer-command-prompt";

import { drawHeader } from "./lib/header";
import { green } from "chalk";
import { checkVersion } from "./lib/version";
import { initializeProgram, programModules } from "./lib/program";

const questions = [
    {
        type: "command",
        name: "prompt",
        message: "pbi",
        prefix: "",
        suffix: ">",
    },
];

const modules = programModules;
const program = initializeProgram(modules);

inquirerCommandPrompt.setConfig({
    history: {
        save: true,
        folder: join(homedir(), ".powerbi-cli"),
        limit: 50,
        blacklist: ["exit"],
    },
});

let args: string[] = process.argv;

if (args?.length === 2) {
    // Interactive mode
    drawHeader(false);
    process.env.PBICLI_interactive = "true";
    let activeModule: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    inquirer.registerPrompt("command", require("inquirer-command-prompt"));
    const prompt = async () =>
        inquirer.prompt(questions).then(async (answer) => {
            const input: string = answer.prompt as string;
            switch (input) {
                case "/":
                    activeModule = [];
                    break;
                case "debug":
                    process.env.DEBUG = process.env.DEBUG === "true" ? "false" : "true";
                    console.info(`Toggle debug to ${process.env.DEBUG}`);
                    break;
                case "exit":
                    process.env.PBICLI_interactive = undefined;
                    break;
                default:
                    if (input.startsWith("-")) break;
                    args = input.split(" ");
                    program.helpPrompt = args.some((arg: string) => arg === "help") ? "true" : "false";
                    if (modules.some((mod: string) => input === mod)) {
                        activeModule = [input];
                    } else {
                        args = fixHelpOptions(args, true);
                        try {
                            await program.parseAsync(activeModule.concat(args), { from: "user" });
                        } catch (err) {
                            program.errorMessage = err;
                            program.showHelpOrError(true);
                        }
                    }
                    break;
            }
            questions[0].message = ["pbi"].concat(activeModule).join("\\");
            if (program.isInteractive) prompt();
        });
    console.info(`For more information type ${green("help")}, to exit type ${green("exit")}`);
    prompt();
} else {
    // Commandline mode
    const process = async () => {
        await checkVersion(args);
        args = fixHelpOptions(args, false);
        await program.parseAsync(args).catch((err) => {
            program.errorMessage = err;
            program.showHelpOrError(true);
        });
    };
    process();
}

function fixHelpOptions(args: string[], interactive: boolean): string[] {
    if (args.some((arg: string) => arg === "--help" || arg === "-h")) args.splice(2, 0, "help");
    if (!args.some((arg: string) => arg === "help")) return args;
    let newArgs: string[] = interactive ? args : args.slice(2);
    if (newArgs.length !== 1) {
        const firstOption = newArgs.findIndex((arg: string) => arg.startsWith("-"));
        if (firstOption > -1) newArgs = newArgs.slice(0, firstOption);
        if (newArgs.length > 1) {
            newArgs.splice(newArgs.indexOf("help"), 1);
            const lastCmd = newArgs.pop() as string;
            newArgs.push("help");
            newArgs.push(lastCmd);
        }
    }
    if (!interactive) newArgs = args.slice(0, 2).concat(newArgs);
    return newArgs;
}
