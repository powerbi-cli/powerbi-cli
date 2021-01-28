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
import { listshowAction } from "./listshow";
import { cloneAction } from "./clone";

export function getCommands(): ModuleCommand {
    const cloneCommand = new ModuleCommand("create")
        .description("Clone a Power BI dashboard tile")
        .action(cloneAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dashboard -d <dashboard>", "Name of the Power BI dashboard")
        .option("--tile -t <tile>", "Name or ID of the Power BI dashboard tile")
        .option("--dest-dashboard <destdashboard>", "ID of the destination Power BI dashboard")
        .option("--dest-workspace [destworkspace]", "ID of the destination Power BI workspace")
        .option("--dest-model [destmodel]", "ID of the destination Power BI model/dataset")
        .option("--dest-report [destreport]", "ID of the destination Power BI report")
        .option("--abort", "If set the clone action will be arborted if the row/column position is not available");
    const listCommand = new ModuleCommand("list")
        .action(listshowAction)
        .description("List Power BI dashboard tiles in a workplace")
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dashboard -d <dashboard>", "Name or ID of the Power BI dashboard");
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI dashboard tile")
        .action(listshowAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dashboard -d <dashboard>", "Name or ID of the Power BI dashboard")
        .option("--tile -t <tile>", "Name or ID of the Power BI dashboard tile");
    showCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("tile")
        .description("Manage Power BI dashboard tiles")
        .addCommand(cloneCommand)
        .addCommand(listCommand)
        .addCommand(showCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
