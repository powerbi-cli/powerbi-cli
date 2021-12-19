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

import { ModuleCommand } from "../../lib/command";
import { listAction } from "./list";
import { listUserAction } from "./list-user";

export function getCommands(): ModuleCommand {
    const listCommand = new ModuleCommand("list")
        .description("Returns a list of apps in the organization")
        .action(listAction)
        .option("--top <number>", "Returns only the first <number> results. Default: 5000");
    listCommand.addGlobalOptions();
    const listUserCommand = new ModuleCommand("list-user")
        .description("Returns a list of users that have access to the specified app")
        .action(listUserAction)
        .option("--app -a <name>", "Name or ID of the Power BI app");
    listUserCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("app")
        .description("Manage apps as admin")
        .addCommand(listCommand)
        .addCommand(listUserCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
