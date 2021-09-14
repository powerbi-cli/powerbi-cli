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

import { ModuleCommand } from "../lib/command";
import { listAction } from "./list";
import { setAction } from "./set";

export function getCommands(): ModuleCommand {
    const listCommand = new ModuleCommand("list").action(listAction).description("List all applicable defaults");
    listCommand.addGlobalOptions();
    const setCommand = new ModuleCommand("set")
        .action(setAction)
        .description("Set the defaults arguments")
        .option("--defaults -d <default...>", "Space-separated 'name=value' pairs for common argument defaults");
    setCommand.addGlobalOptions();
    const configureCommand = new ModuleCommand("configure")
        .description("Manage Power BI CLI configuration")
        .addCommand(listCommand)
        .addCommand(setCommand);
    configureCommand.addGlobalOptions();

    return configureCommand;
}
