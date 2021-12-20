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
import { getCommands as getAppCommands } from "./app/index";
import { getCommands as getCapacityCommands } from "./capacity/index";
import { getCommands as getDashboardCommands } from "./dashboard/index";
import { getCommands as getDataflowCommands } from "./dataflow/index";
import { getCommands as getDatasetCommands } from "./dataset/index";
import { getCommands as getLabelCommands } from "./label/index";
import { getCommands as getPipelineCommands } from "./pipeline/index";
import { getCommands as getReportCommands } from "./report/index";
import { getCommands as getGroupCommands } from "./group/index";
import { getCommands as getKeyCommands } from "./key/index";
import { getCommands as getUserCommands } from "./user/index";
import { activityAction } from "./activity";
import { importAction } from "./import";
import { expandAdminImports, expandRefreshes } from "../lib/helpers";
import { refreshAction } from "./refresh";

export function getCommands(): ModuleCommand {
    const activityCommand = new ModuleCommand("activity")
        .description("Returns a list of audit activity events for a tenant")
        .action(activityAction)
        .option(
            "--filter <filter>",
            "Filters the results based on a boolean condition, using 'Activity', 'UserId', or both properties. Supports only 'eq' and 'and' operators"
        )
        .option("--continuation-token <token>", "Token required to get the next chunk of the result set")
        .option("--date <date>", "Date for audit event results. Used with (optional) time values")
        .option(
            "--start-time <time>",
            "Start UTC time of the window for audit event results. If not provided '00:00:00' will be used"
        )
        .option(
            "--end-time <time>",
            "End UTC time of the window for audit event results. If not provided '23:59:59' will be used"
        );
    activityCommand.addGlobalOptions();
    const importCommand = new ModuleCommand("import")
        .description("Returns a list of imports for the organization")
        .action(importAction)
        .option(
            "--expand <entity>",
            `Expands related entities inline, receives a comma-separated list of data types. Allowed values: ${expandAdminImports.join(
                ", "
            )}`
        )
        .option("--filter <filter>", "Filters the results based on a boolean condition")
        .option("--top <number>", "Returns only the first <number> results. Default: 5000")
        .option("--skip <number>", "Skips the first <number> results");
    importCommand.addGlobalOptions();
    const refreshCommand = new ModuleCommand("refresh")
        .description("Returns a list of imports for the organization")
        .action(refreshAction)
        .option("--capacity -c <name>", "Name or ID of the Power BI capacity")
        .option("--refreshable-id <refreshId>", "The refreshable id")
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
    const appCommand = new ModuleCommand("admin").description("Operations for working with administrative tasks");
    appCommand
        .addCommand(activityCommand)
        .addCommand(importCommand)
        .addCommand(refreshCommand)
        .addCommand(getAppCommands())
        .addCommand(getCapacityCommands())
        .addCommand(getDashboardCommands())
        .addCommand(getDataflowCommands())
        .addCommand(getDatasetCommands())
        .addCommand(getKeyCommands())
        .addCommand(getLabelCommands())
        .addCommand(getPipelineCommands())
        .addCommand(getReportCommands())
        .addCommand(getGroupCommands())
        .addCommand(getUserCommands());
    appCommand.addGlobalOptions();
    return appCommand;
}
