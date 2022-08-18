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
import { createAction } from "./create";
import { deleteAction } from "./delete";
import { deployAction } from "./deploy";
import { listshowAction } from "./listshow";
import { assignAction } from "./assign";
import { updateAction } from "./update";
import { getCommands as getStageCommands } from "./stage/index";
import { getCommands as getOperationCommands } from "./operation/index";
import { getCommands as getUserCommands } from "./user/index";

export function getCommands(): ModuleCommand {
    const assignCommand = new ModuleCommand("assign")
        .description("Assigns the workspace to the specified deployment pipeline stage")
        .action(assignAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline")
        .option("--stage <number>", "The deployment pipeline stage order. Development (0), Test (1), Production (2)")
        .option("--workspace -w <name>", "Name of the Power BI workspace");
    assignCommand.addGlobalOptions();
    const createCommand = new ModuleCommand("create")
        .description("Creates a Power BI pipeline")
        .action(createAction)
        .option("--pipeline -p <name>", "Name of the Power BI pipeline");
    createCommand.addGlobalOptions();
    const deleteCommand = new ModuleCommand("delete")
        .description("Delete a Power BI pipeline")
        .action(deleteAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline");
    deleteCommand.addGlobalOptions();
    const deployCommand = new ModuleCommand("deploy")
        .description("Start a deploy from a specific stage in a Power BI pipeline")
        .action(deployAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline")
        .option("--partial", "")
        .option("--options <data>", "String with the deploy options in JSON format. Use @{file} to load from a file")
        .option(
            "--options-file <file>",
            "File with the deploy options in JSON format. Deprecated: use --options @{file}"
        );
    deployCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list").description("List Power BI pipelines").action(listshowAction);
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI pipeline")
        .action(listshowAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline");
    showCommand.addGlobalOptions();
    const unassignCommand = new ModuleCommand("unassign")
        .description("Unassigns the workspace to the specified deployment pipeline stage")
        .action(assignAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline")
        .option("--stage <number>", "The deployment pipeline stage order. Development (0), Test (1), Production (2)");
    unassignCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Update pipeline properties")
        .action(updateAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline")
        .option(
            "--update <data>",
            "String with the update pipeline settings in JSON format. Use @{file} to load from a file"
        )
        .option(
            "--update-file <file>",
            "File with the update pipeline settings in JSON format. Deprecated: use --update @{file}"
        );
    updateCommand.addGlobalOptions();
    const pipelineCommand = new ModuleCommand("pipeline")
        .description("Operations for working with pipelines")
        .addCommand(assignCommand)
        .addCommand(createCommand)
        .addCommand(deleteCommand)
        .addCommand(deployCommand)
        .addCommand(listCommand)
        .addCommand(showCommand)
        .addCommand(unassignCommand)
        .addCommand(getOperationCommands())
        .addCommand(getStageCommands())
        .addCommand(getUserCommands());
    pipelineCommand.addGlobalOptions();
    return pipelineCommand;
}
