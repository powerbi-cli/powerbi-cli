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
import { dataflowAction } from "./dataflow";
import { deleteAction } from "./delete";
import { setOwnerAction } from "./set-owner";
import { queryAction } from "./query";
import { getCommands as getParameterCommands } from "./parameter/index";
import { getCommands as getGatewayCommands } from "./gateway/index";
import { getCommands as getDatasourceCommands } from "./datasource/index";
import { getCommands as getRefreshCommands } from "./refresh/index";

export function getCommands(): ModuleCommand {
    const deleteCommand = new ModuleCommand("delete")
        .description("Deletes a Power BI dataset from a group")
        .action(deleteAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset");
    deleteCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("List Power BI datasets in a group")
        .action(listshowAction)
        .option(
            "--workspace -w <name>",
            "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'"
        );
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI dataset")
        .action(listshowAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset");
    showCommand.addGlobalOptions();
    const setOwnerCommand = new ModuleCommand("set-owner")
        .description("Set the owner of a Power BI dataset to the current user / service principal")
        .action(setOwnerAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset");
    setOwnerCommand.addGlobalOptions();
    const dataflowCommand = new ModuleCommand("dataflow")
        .description("Get the dataflows uplinks of a Power BI dataset")
        .action(dataflowAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset");
    dataflowCommand.addGlobalOptions();
    const queryCommand = new ModuleCommand("query")
        .description("Execute an DAX query against the Power BI XMLA endpoint")
        .action(queryAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. Optional if dataset is provided as ID.")
        .option("--dataset -d <dataset>", "Name or ID of the Power BI dataset")
        .option("--dax <query>", "String with the DAX query to be executed")
        .option("--script <script>", "String with the raw query statement in JSON format")
        .option("--script-file <file>", "File with the raw query statement in JSON format");
    queryCommand.addGlobalOptions();
    const datassetCommand = new ModuleCommand("dataset")
        .description("Manage Power BI datasets")
        .addCommand(deleteCommand)
        .addCommand(listCommand)
        .addCommand(setOwnerCommand)
        .addCommand(showCommand)
        .addCommand(dataflowCommand)
        .addCommand(queryCommand)
        .addCommand(getDatasourceCommands())
        .addCommand(getGatewayCommands())
        .addCommand(getParameterCommands())
        .addCommand(getRefreshCommands());
    datassetCommand.addGlobalOptions();
    return datassetCommand;
}
