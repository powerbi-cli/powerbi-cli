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

import { expandRefreshes, workloadState } from "../lib/helpers";
import { ModuleCommand } from "../lib/command";
import { listAction } from "./list";
import { refreshAction } from "./refresh";
import { workloadAction } from "./workload";
import { assignAction } from "./assign";

export function getCommands(): ModuleCommand {
    const assignCommand = new ModuleCommand("assign")
        .description("Assigns the specified workspace to the specified capacity")
        .action(assignAction)
        .option("--capacity -c <name>", "Name or ID of the Power BI capacity")
        .option(
            "--workspace -w <name>",
            "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'"
        );
    assignCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("Returns a list of capacities the user has access to")
        .action(listAction);
    listCommand.addGlobalOptions();
    const statusCommand = new ModuleCommand("status")
        .description("Gets the status of the assignment to capacity operation of the specified workspace")
        .action(assignAction)
        .option(
            "--workspace -w <name>",
            "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'"
        );
    statusCommand.addGlobalOptions();
    const refreshCommand = new ModuleCommand("refresh")
        .description("Returns a list of imports for the organization")
        .action(refreshAction)
        .option("--capacity -c <name>", "Name or ID of the Power BI capacity")
        .option("--refreshableId <refreshId>", "The refreshable id")
        .option(
            "--expand <entity>",
            `Expands related entities inline, receives a comma-separated list of data types. Allowed values: ${expandRefreshes.join(
                ", "
            )}`
        )
        .option("--filter <filter>", "Filters the results based on a boolean condition")
        .option("--top <number>", "Returns only the first <number> results. Default: 5000")
        .option("--skip <number>", "Skips the first <number> results");
    refreshCommand.addGlobalOptions();
    const unassignCommand = new ModuleCommand("unassign")
        .description("Unassigns the specified workspace to the specified capacity")
        .action(assignAction)
        .option(
            "--workspace -w <name>",
            "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'"
        );
    unassignCommand.addGlobalOptions();
    const workloadCommand = new ModuleCommand("workload")
        .description("Manage the the state of capacity workloads")
        .action(workloadAction)
        .option("--capacity -c <name>", "Name or ID of the Power BI capacity")
        .option("--workload <name>", "Name the Power BI workload")
        .option("--state <state>", `The capacity workload state. Allowed values: ${workloadState.join(", ")}`)
        .option("--memory <number>", "The memory percentage maximum limit");
    workloadCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("capacity")
        .description("Manage Power BI capacities")
        .addCommand(assignCommand)
        .addCommand(listCommand)
        .addCommand(refreshCommand)
        .addCommand(statusCommand)
        .addCommand(unassignCommand)
        .addCommand(workloadCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
