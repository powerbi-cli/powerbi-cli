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

import { ModuleCommand } from "./command";

import { addDocumenter } from "./document";

export const programModules: [string, boolean][] = [
    ["admin", false],
    ["app", false],
    ["capacity", false],
    ["cloud", false],
    ["configure", false],
    ["dashboard", false],
    ["dataflow", false],
    ["dataset", false],
    ["embedded", false],
    ["feature", false],
    ["gateway", false],
    ["import", false],
    ["report", false],
    ["pipeline", false],
    ["scorecard", false],
    ["group", false], // workspace
    ["user", false],
    ["xmla", true],
    ["login", false],
    ["logout", false],
    ["rest", false],
];

export function initializeProgram(modules: [string, boolean][]): ModuleCommand {
    const program = new ModuleCommand("pbicli");

    modules.forEach((module: [string, boolean]) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        program.addCommand(require(`../${module[0]}/index`).getCommands(), { hidden: module[1] });
    });

    program.addGlobalOptions();

    addDocumenter(program);

    return program;
}

export function isSubgroup(commandName: string): boolean {
    return programModules.some((module) => module[0] === commandName);
}
