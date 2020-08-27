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
import { updateAction } from "./update";
import { startAction } from "./start";

export function getCommands(): ModuleCommand {
    const updateCommand = new ModuleCommand("update")
        .description("Update a Power BI refresh schedule")
        .action(updateAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataflow -f <dataflow>", "Name or ID of the Power BI dataflow")
        .option("--refresh-schedule <data>", "String with the refresh schedule in JSON format")
        .option("--refresh-schedule-file <file>", "File with the refresh schedule in JSON format");
    updateCommand.addGlobalOptions();
    const startCommand = new ModuleCommand("start")
        .description("Get the details of a Power BI refresh schedule")
        .action(startAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataflow -f <dataflow>", "Name or ID of the Power BI dataflow");
    const refreshCommand = new ModuleCommand("refresh")
        .description("Manage Power BI refresh schedule")
        .addCommand(updateCommand)
        .addCommand(startCommand);
    refreshCommand.addGlobalOptions();
    return refreshCommand;
}
