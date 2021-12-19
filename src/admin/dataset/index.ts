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
import { dataflowAction } from "./dataflow";
import { datasourceAction } from "./datasource";
import { listAction } from "./list";
import { listUserAction } from "./list-user";

export function getCommands(): ModuleCommand {
    const dataflowCommand = new ModuleCommand("dataflow")
        .description("Returns a list of upstream dataflows in a Power BI workspace")
        .action(dataflowAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace");
    dataflowCommand.addGlobalOptions();
    const datasourceCommand = new ModuleCommand("datasource")
        .description("Returns a list of datasources for the specified dataset")
        .action(datasourceAction)
        .option("--dataset -d <name>", "Name or ID of the Power BI dataset");
    datasourceCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("Returns a list of datasets for the organization")
        .action(listAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--filter <filter>", "Filters the results based on a boolean condition")
        .option("--top <number>", "Returns only the first <number> results. Default: 5000")
        .option("--skip <number>", "Skips the first <number> results");
    listCommand.addGlobalOptions();
    const listUserCommand = new ModuleCommand("list-user")
        .description("Returns a list of users that have access to the specified dataset")
        .action(listUserAction)
        .option("--dataset -d <name>", "Name or ID of the Power BI dataset");
    listUserCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("dataset")
        .description("Manage datasets as admin")
        .addCommand(dataflowCommand)
        .addCommand(datasourceCommand)
        .addCommand(listCommand)
        .addCommand(listUserCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
