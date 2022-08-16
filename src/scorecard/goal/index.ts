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
import { createAction } from "./create";
import { deleteAction } from "./delete";
import { disconnectAction } from "./disconnect";
import { listshowAction } from "./listshow";
import { refreshAction } from "./refresh";
import { updateAction } from "./update";
import { getCommands as getValueCommands } from "./value/index";

export function getCommands(): ModuleCommand {
    const createCommand = new ModuleCommand("create")
        .description("Adds a new goal to a scorecard")
        .action(createAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name of the Power BI scorecard goal")
        .option(
            "--definition <definition>",
            "String with the goal definition in JSON format. Use @{file} to load from a file"
        )
        .option(
            "--definition-file <file>",
            "File with the goal definition in JSON format. Deprecated: use --definition @{file}"
        );
    createCommand.addGlobalOptions();
    const deleteCommand = new ModuleCommand("delete")
        .description("Deletes a goal from a Power BI scorecard")
        .action(deleteAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal");
    deleteCommand.addGlobalOptions();
    const disconnectCommand = new ModuleCommand("disconnect")
        .description("Disconnects the current value or target of a connected goal")
        .action(disconnectAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal")
        .option("--current", "Disconnect the current value of the goal")
        .option("--target", "Disconnect the target value of the goal");
    disconnectCommand.addGlobalOptions();
    const historyCommand = new ModuleCommand("history")
        .description("Gets the refresh history of a connected goal")
        .action(deleteAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal");
    historyCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .action(listshowAction)
        .description("List Power BI scorecard goals in a workplace")
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard");
    listCommand.addGlobalOptions();
    const refreshCommand = new ModuleCommand("refresh")
        .description("Schedules a refresh of the current value or target of a connected goal")
        .action(refreshAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal")
        .option("--current", "Schedules a refresh of the current value of the goal")
        .option("--target", "Schedules a refresh of the target value of the goal");
    refreshCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI scorecard connected goal")
        .action(listshowAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name or ID of the Power BI scorecard goal");
    showCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Update a goal of a Power BI scorecard")
        .action(updateAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--scorecard -s <scorecard>", "Name of the Power BI scorecard")
        .option("--goal -g <goal>", "Name of the Power BI scorecard goal")
        .option(
            "--definition <definition>",
            "String with the goal definition in JSON format. Use @{file} to load from a file"
        );
    updateCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("goal")
        .description("Operations for working with scorecard goals")
        .addCommand(createCommand)
        .addCommand(deleteCommand)
        .addCommand(disconnectCommand)
        .addCommand(historyCommand)
        .addCommand(listCommand)
        .addCommand(refreshCommand)
        .addCommand(showCommand)
        .addCommand(getValueCommands());
    appCommand.addGlobalOptions();
    return appCommand;
}
