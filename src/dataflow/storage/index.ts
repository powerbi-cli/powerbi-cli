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
import { assignAction } from "./assign";
import { listAction } from "./list";

export function getCommands(): ModuleCommand {
    const assignCommand = new ModuleCommand("assign")
        .description("Assign a Power BI group to a dataflow storage account")
        .action(assignAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--storage-account <storage>", "ID of the Power BI dataflow storage account");
    assignCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("List Power BI dataflow storage accounts")
        .action(listAction);
    listCommand.addGlobalOptions();
    const unassignCommand = new ModuleCommand("unassign")
        .description("Unassign a Power BI group to a dataflow storage account")
        .action(assignAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace");
    unassignCommand.addGlobalOptions();
    const refreshCommand = new ModuleCommand("storage")
        .description("Manage Power BI dataflow storage accounts")
        .addCommand(assignCommand)
        .addCommand(listCommand)
        .addCommand(unassignCommand);
    refreshCommand.addGlobalOptions();
    return refreshCommand;
}
