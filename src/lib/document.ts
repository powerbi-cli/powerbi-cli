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

import { Command, OptionValues } from "commander";
import { createWriteStream, existsSync } from "fs";
import { format } from "path";

import { AllGlobalCommands, GlobalCommands, GlobalOptions } from "./command";

const IgnoreCommands = ["help"];
const IgnoreSyntax = ["interactive"];

export function addDocumenter(program: Command): void {
    program
        .command("documenter", { hidden: true })
        .option("--output-dir <directory>", "Save response payload to this directory")
        .action((...args: unknown[]) => {
            const options = args[args.length - 2] as OptionValues;
            if (options.outputDir === undefined || !existsSync(options.outputDir)) {
                console.error("Missing or incorrect '--output-dir");
                return;
            }
            let access;
            const setStoreFile = (fileName: string) => {
                access = createWriteStream(format({ dir: options.outputDir, base: fileName }));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
                process.stdout.write = <any>access.write.bind(access);
            };
            const helper = program.createHelp();

            const commands = helper
                .visibleCommands(program)
                .filter((cmd) => !IgnoreCommands.some((cmdOption) => cmd.name() === cmdOption))
                .sort((cmd1, cmd2) => (cmd1.name() > cmd2.name() ? 1 : -1));

            const processMarkdown = (commands: Command[], parent: string[], level: number, index: boolean) => {
                if ((index && level === 0) || (!index && level === 1 && commands.length > 0)) {
                    setStoreFile(`reference-${parent[parent.length - 1]}.md`);
                    console.log(`---`);
                    console.log(`uid: reference/${parent[parent.length - 1]}`);
                    console.log(`title: ${parent.join(" ")}`);
                    console.log(`documentId: `);
                    console.log(`---`);
                    console.log();
                    console.log(`# ${parent.join(" ")}`);
                    console.log();
                    console.log("## Commands");
                    console.log();
                    console.log("| | |");
                    console.log("|-|-|");

                    const processTable = (commands: Command[], parent: string[]) => {
                        commands.forEach((cmd) => {
                            const childCommands = helper
                                .visibleCommands(cmd)
                                .filter((cmd) => !AllGlobalCommands.some((cmdOption) => cmd.name() === cmdOption))
                                .sort((cmd1, cmd2) => (cmd1.name() > cmd2.name() ? 1 : -1));
                            if (childCommands.length === 0) {
                                console.log(
                                    `| [${parent.join(" ")} ${cmd.name()}](#${parent.join(
                                        "-"
                                    )}-${cmd.name()}) | ${helper.subcommandDescription(cmd)} |`
                                );
                            } else if (level === 0) {
                                console.log(
                                    `| [${parent.join(" ")} ${cmd.name()}](${
                                        level === 0
                                            ? `xref:reference/${cmd.name()}`
                                            : `#${parent.join("-")}-${cmd.name()}`
                                    }) | ${helper.subcommandDescription(cmd)} |`
                                );
                            }
                            if (!index) processTable(childCommands, [...parent, cmd.name()]);
                        });
                    };

                    processTable(commands, parent);

                    console.log();
                }
                commands.forEach((cmd) => {
                    const options = helper
                        .visibleOptions(cmd)
                        .filter((option) => !GlobalOptions.some((cmdOption) => option.name() === cmdOption));
                    const childCommands = helper
                        .visibleCommands(cmd)
                        .filter((cmd) => !AllGlobalCommands.some((c) => cmd.name() === c))
                        .sort((cmd1, cmd2) => (cmd1.name() > cmd2.name() ? 1 : -1));
                    if (childCommands.length === 0) {
                        console.log(`## ${parent.join(" ")} ${cmd.name()}`);
                        console.log();
                        console.log(helper.subcommandDescription(cmd));
                        console.log();
                        console.log("```bash");
                        console.log(
                            `${parent.join(" ")} ${cmd.name()} ${
                                options.length > 0
                                    ? `${options[0].short ? `[${options[0].short}] ` : ""}[${options[0].long}]`
                                    : ""
                            }`
                        );
                        options
                            .slice(1)
                            .forEach((option) =>
                                console.log(
                                    `${" ".repeat(`${parent.join(" ")} ${cmd.name()} `.length)}${
                                        option.short ? `[${option.short}] ` : ""
                                    }[${option.long}]`
                                )
                            );
                        console.log("```");
                        console.log();
                        if (options.length > 0) {
                            console.log("### Parameters");
                            console.log();
                            options.forEach((option) => {
                                console.log(
                                    `-   \`${helper.optionTerm(option)}\`<br/>${helper.optionDescription(option)}`
                                );
                                console.log();
                            });
                            console.log();
                        }
                        console.log(`> [!div class="global-parameters"]`);
                        console.log(`>`);
                        console.log(`> [Global Parameters](xref:global)`);
                        console.log();
                    }
                    if (!index) {
                        if (childCommands) processMarkdown(childCommands, parent.concat(cmd.name()), level + 1, false);
                    }
                });
                if ((index && level === 0) || (!index && level === 1 && commands.length > 0)) {
                    console.log(`## Feedback`);
                }
            };

            const processToc = (commands: Command[], parent: string[], level: number) => {
                commands.forEach((cmd) => {
                    const childCommands = helper
                        .visibleCommands(cmd)
                        .filter((cmd) => !AllGlobalCommands.some((c) => cmd.name() === c))
                        .sort((cmd1, cmd2) => (cmd1.name() > cmd2.name() ? 1 : -1));
                    const indent = "    ".repeat(level);
                    console.log(`${indent}- name: ${cmd.name()}`);
                    if (childCommands.length === 0) {
                        console.log(
                            `${indent}  href: reference-${parent[1] || "index"}.md#${parent.join("-")}-${cmd.name()}`
                        );
                    }
                    if (childCommands.length > 0) {
                        console.log(`${indent}  items:`);
                        if (level === 0) {
                            console.log(`${indent}    - name: Overview`);
                            console.log(`${indent}      href: reference-${cmd.name()}.md`);
                        }
                    }
                    if (childCommands) processToc(childCommands, parent.concat(cmd.name()), level + 1);
                });
            };

            processMarkdown(commands, ["pbicli"], 0, true);
            processMarkdown(
                commands.filter((cmd) => !IgnoreSyntax.some((c) => cmd.name() === c)),
                ["pbicli"],
                0,
                false
            );
            setStoreFile("toc.yml");
            processToc(
                commands.filter((cmd) => !AllGlobalCommands.some((c) => cmd.name() === c)),
                ["pbicli"],
                0
            );
        });
}
