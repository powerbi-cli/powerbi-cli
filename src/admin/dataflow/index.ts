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
import { OptionValues } from "commander";

import { ModuleCommand } from "../../lib/command";
import { datasourceAction } from "./datasource";
import { exportAction } from "./export";
import { listAction } from "./list";
import { upstreamAction } from "./upstream";

export function getCommands(): ModuleCommand {
    const datasourceCommand = new ModuleCommand("datasource")
        .description("Returns a list of datasources for the specified dataflow")
        .action(datasourceAction)
        .option("--dataflow -d <name>", "Name or ID of the Power BI dataflow");
    datasourceCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("Returns a list of dataflows for the organization")
        .action(listAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--filter <filter>", "Filters the results based on a boolean condition")
        .option("--top <number>", "Returns only the first <number> results. Default: 5000")
        .option("--skip <number>", "Skips the first <number> results");
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Exports the specified dataflow definition")
        .action(exportAction)
        .option("--dataflow -d <name>", "Name or ID of the Power BI dataflow");
    showCommand.addGlobalOptions();
    const upstreamCommand = new ModuleCommand("upstream")
        .description("Returns a list of upstream dataflows for the specified dataflow in a Power BI workspace")
        .action(upstreamAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--dataflow -d <name>", "Name or ID of the Power BI dataflow");
    upstreamCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("dataflow")
        .description("Manage dataflows as admin")
        .addCommand(datasourceCommand)
        .addCommand(listCommand)
        .addCommand(showCommand)
        .addCommand(upstreamCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
