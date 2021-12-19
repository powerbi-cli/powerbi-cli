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
import { subscriptionAction } from "./subscription";

export function getCommands(): ModuleCommand {
    const listCommand = new ModuleCommand("list")
        .description("Returns a list of reports for the organization")
        .action(listAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--filter <filter>", "Filters the results based on a boolean condition")
        .option("--top <number>", "Returns only the first <number> results. Default: 5000")
        .option("--skip <number>", "Skips the first <number> results");
    listCommand.addGlobalOptions();
    const listUserCommand = new ModuleCommand("list-user")
        .description("Returns a list of users that have access to the specified dataset")
        .action(listUserAction)
        .option("--report -r <report>", "Name or ID of the Power BI report");
    listUserCommand.addGlobalOptions();
    const subscriptionCommand = new ModuleCommand("subscription")
        .description("Returns a list of users that have access to the specified dataset")
        .action(subscriptionAction)
        .option("--report -r <report>", "Name or ID of the Power BI report");
    subscriptionCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("report")
        .description("Operations for working with reports as admin")
        .addCommand(listCommand)
        .addCommand(listUserCommand)
        .addCommand(subscriptionCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
