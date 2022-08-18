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
import { listshowAction } from "./listshow";
import { moveAction } from "./move";
import { updateAction } from "./update";
import { getCommands as getGoalCommands } from "./goal/index";

export function getCommands(): ModuleCommand {
    const createCommand = new ModuleCommand("create")
        .description("Create a Power BI scorecard")
        .action(createAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--description <description>", "Description of the Power BI scorecard")
        .option("--contact <contact>", "Contact of the Power BI scorecard");
    createCommand.addGlobalOptions();
    const deleteCommand = new ModuleCommand("delete")
        .description("Delete a Power BI scorecard")
        .action(deleteAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <name>", "Name or ID of the Power BI scorecard");
    deleteCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("List Power BI scorecards")
        .action(listshowAction)
        .option(
            "--workspace -w <name>",
            "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'"
        );
    listCommand.addGlobalOptions();
    const moveCommand = new ModuleCommand("move")
        .description("Moves goals within the scorecard")
        .action(moveAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <name>", "Name or ID of the Power BI scorecard")
        .option(
            "--definition <definition>",
            "String with the 'goal move' definition in JSON format. Use @{file} to load from a file"
        )
        .option(
            "--definition-file <file>",
            "File with the 'goal move' definition in JSON format. Deprecated: use --definition @{file}"
        );
    moveCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI scorecard")
        .action(listshowAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--report -r <name>", "Name or ID of the linked Power BI report")
        .option("--scorecard -s <name>", "Name or ID of the Power BI scorecard");
    showCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Update a Power BI scorecard")
        .action(updateAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <name>", "Name or ID of the Power BI scorecard")
        .option(
            "--definition <definition>",
            "String with the scorecard definition in JSON format. Use @{file} to load from a file"
        )
        .option(
            "--definition-file <file>",
            "File with the scorecard definition in JSON format. Deprecated: use --definition @{file}"
        );
    updateCommand.addGlobalOptions();
    const gatewayCommand = new ModuleCommand("scorecard")
        .description("Operations for working with scorecards (goals)")
        .addCommand(createCommand)
        .addCommand(deleteCommand)
        .addCommand(listCommand)
        .addCommand(moveCommand)
        .addCommand(showCommand)
        .addCommand(updateCommand)
        .addCommand(getGoalCommands());
    gatewayCommand.addGlobalOptions();
    return gatewayCommand;
}
