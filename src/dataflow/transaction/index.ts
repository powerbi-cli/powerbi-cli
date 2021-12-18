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
import { cancelAction } from "./cancel";
import { listAction } from "./list";

export function getCommands(): ModuleCommand {
    const assignCommand = new ModuleCommand("cancel")
        .description("Attempts to cancel a Power BI group dataflow transaction")
        .action(cancelAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--transaction <transaction>", "ID of the Power BI dataflow transaction");
    assignCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("List Power BI dataflow Transactions")
        .action(listAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataflow -f <dataflow>", "Name or ID of the Power BI dataflow");
    listCommand.addGlobalOptions();
    const refreshCommand = new ModuleCommand("transaction")
        .description("Manage Power BI dataflow Transactions")
        .addCommand(assignCommand)
        .addCommand(listCommand);
    refreshCommand.addGlobalOptions();
    return refreshCommand;
}