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
import { listshowAction } from "./listshow";
import { deleteAction } from "./delete";
import { upstreamAction } from "./upstream";
import { datasourceAction } from "./datasource";
import { getCommands as getRefreshCommands } from "./refresh/index";
import { getCommands as getStorageCommands } from "./storage/index";
import { getCommands as getTransactionCommands } from "./transaction/index";

export function getCommands(): ModuleCommand {
    const datasourceCommand = new ModuleCommand("datasource")
        .description("Get the datasources of a Power BI dataflow")
        .action(datasourceAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--dataflow -f <dataflow>", "Name or ID of the Power BI dataflow");
    datasourceCommand.addGlobalOptions();
    const deleteCommand = new ModuleCommand("delete")
        .description("Deletes a Power BI dataflow from a group")
        .action(deleteAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataflow -f <dataflow>", "Name or ID of the Power BI dataflow");
    deleteCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .action(listshowAction)
        .description("List Power BI dataflows in a group")
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace");
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI dataflow")
        .action(listshowAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--dataflow -f <dataflow>", "Name or ID of the Power BI dataflow");
    showCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Update dataflow properties, capabilities and settings")
        .action(deleteAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataflow -f <dataflow>", "Name or ID of the Power BI dataflow")
        .option("--update <data>", "String with the update dataflow settings in JSON format")
        .option("--update-file <file>", "File with the update dataflow settings in JSON format");
    updateCommand.addGlobalOptions();
    const upstreamCommand = new ModuleCommand("upstream")
        .description("Get the upstream dataflows of a Power BI dataflow")
        .action(upstreamAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--dataflow -f <dataflow>", "Name or ID of the Power BI dataflow");
    upstreamCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("dataflow")
        .description("Manage Power BI dataflows")
        .addCommand(datasourceCommand)
        .addCommand(deleteCommand)
        .addCommand(listCommand)
        .addCommand(showCommand)
        .addCommand(updateCommand)
        .addCommand(upstreamCommand)
        .addCommand(getRefreshCommands())
        .addCommand(getStorageCommands())
        .addCommand(getTransactionCommands());
    appCommand.addGlobalOptions();
    return appCommand;
}
