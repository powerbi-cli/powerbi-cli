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
import { pageAction } from "./page";
import { deleteAction } from "./delete";
import { cloneAction } from "./clone";
import { datasourceAction } from "./datasource";
import { rebindAction } from "./rebind";
import { updateAction } from "./update";
import { getCommands as getExportCommands } from "./export/index";

export function getCommands(): ModuleCommand {
    const datasourceCommand = new ModuleCommand("datasource")
        .description("Datasources a Power BI report from a group")
        .action(datasourceAction)
        .option("--group -g <name>", "Name or ID of the Power BI group. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report");
    datasourceCommand.addGlobalOptions();
    const deleteCommand = new ModuleCommand("delete")
        .description("Deletes a Power BI report from a group")
        .action(deleteAction)
        .option("--group -g <name>", "Name or ID of the Power BI group. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report");
    deleteCommand.addGlobalOptions();
    const cloneCommand = new ModuleCommand("clone")
        .description("Clones a Power BI report from a group")
        .action(cloneAction)
        .option("--group -g <name>", "Name or ID of the Power BI group. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report")
        .option("--name <name>", "Name of the new Power BI report")
        .option(
            "--target-dataset <dataset>",
            "ID of the Power BI dataset for the cloned report. If not provided, the same dataset is used"
        )
        .option(
            "--target-group [group]",
            "ID of the Power BI group for the cloned report. If not provided, the same group is used and if [workspaceId] is not provided 'My workspace' is used"
        );
    cloneCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("List Power BI reports in a group")
        .action(listshowAction)
        .option("--group -g <name>", "Name or ID of the Power BI group. If not provided it uses 'My workspace'");
    listCommand.addGlobalOptions();
    const pageCommand = new ModuleCommand("page")
        .description("Get the details of a Power BI report page")
        .action(pageAction)
        .option("--group -g <name>", "Name or ID of the Power BI group. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report")
        .option("--page-name <name>", "Name of the Power BI report page");
    pageCommand.addGlobalOptions();
    const rebindCommand = new ModuleCommand("rebind")
        .description("Rebind a Power BI report to a dataset")
        .action(rebindAction)
        .option("--group -g <name>", "Name or ID of the Power BI group. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report")
        .option("--target-dataset <dataset>", "ID of the new Power BI dataset for the rebound report");
    rebindCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI report")
        .action(listshowAction)
        .option("--group -g <name>", "Name or ID of the Power BI group. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report");
    showCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Update a Power BI report to a dataset")
        .action(updateAction)
        .option("--group -g <name>", "Name or ID of the Power BI group. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report")
        .option("--source-report <report>", "ID of the source Power BI report")
        .option("--source-group <group>", "ID of the source Power BI group");
    updateCommand.addGlobalOptions();
    const datassetCommand = new ModuleCommand("report")
        .description("Manage Power BI reports")
        .addCommand(datasourceCommand)
        .addCommand(deleteCommand)
        .addCommand(cloneCommand)
        .addCommand(listCommand)
        .addCommand(pageCommand)
        .addCommand(showCommand)
        .addCommand(updateCommand)
        .addCommand(getExportCommands());
    datassetCommand.addGlobalOptions();
    return datassetCommand;
}
