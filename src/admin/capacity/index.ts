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
import { expandCapacity } from "../../lib/helpers";
import { listAction } from "./list";
import { assignAction } from "./assign";
import { unassignAction } from "./unassign";
import { updateAction } from "./update";
import { listUserAction } from "./list-user";

export function getCommands(): ModuleCommand {
    const assignCommand = new ModuleCommand("assign")
        .description("Assigns the provided workspaces to the specified capacity")
        .action(assignAction)
        .option("--capacity -c <name>", "Name or ID of the Power BI capacity")
        .option("--workspace -w <name>", "Name(s) or ID(s) of the Power BI workspace. Use comma seperated if multiple");
    assignCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("Returns a list of capacities for the organization")
        .action(listAction)
        .option("--expand <entity>", `Expands related entities inline. Allowed values: ${expandCapacity.join(", ")}`);
    listCommand.addGlobalOptions();
    const listUserCommand = new ModuleCommand("list-user")
        .description("Returns a list of users that have access to the specified dashboard")
        .action(listUserAction)
        .option("--dashboard -d <name>", "Name or ID of the Power BI dashboard");
    listUserCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Changes the specific capacity information.")
        .action(updateAction)
        .option("--capacity -c <name>", "Name or ID of the Power BI capacity")
        .option("--tenant-key <key>", "The id of the encryption key");
    updateCommand.addGlobalOptions();
    const unassignCommand = new ModuleCommand("unassign")
        .description("Unassigns the provided workspaces from capacity")
        .action(unassignAction)
        .option("--workspace -w <name>", "Name(s) or ID(s) of the Power BI workspace. Use comma seperated if multiple");
    unassignCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("capacity")
        .description("Operations for working with capacities as admin")
        .addCommand(assignCommand)
        .addCommand(listCommand)
        .addCommand(listUserCommand)
        .addCommand(updateCommand)
        .addCommand(unassignCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
