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
import { startstopAction } from "./startstop";
import { updateAction } from "./update";

export function getCommands(): ModuleCommand {
    const listCommand = new ModuleCommand("list")
        .description("Lists all the dedicated capacities for the given subscription")
        .action(listshowAction)
        .option("--subscription -s <subscription>", "Name or ID of the Azure subscription")
        .option("--resource -r <resource>", "(Optional) Name or ID of the Azure Resource group");
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Gets details about the specified dedicated capacity")
        .action(listshowAction)
        .option("--subscription -s <subscription>", "Name or ID of the Azure subscription")
        .option("--resource -r <resource>", "Name or ID of the Azure Resource group")
        .option("--capacity -c <name>", "Name of the Azure dedicated capacity");
    showCommand.addGlobalOptions();
    const startCommand = new ModuleCommand("start")
        .description("Starts the specified dedicated capacity")
        .action(startstopAction)
        .option("--subscription -s <subscription>", "Name or ID of the Azure subscription")
        .option("--resource -r <resource>", "Name or ID of the Azure Resource group")
        .option("--capacity -c <name>", "Name of the Azure dedicated capacity");
    startCommand.addGlobalOptions();
    const stopCommand = new ModuleCommand("stop")
        .description("Stops the specified dedicated capacity")
        .action(startstopAction)
        .option("--subscription -s <subscription>", "Name or ID of the Azure subscription")
        .option("--resource -r <resource>", "Name or ID of the Azure Resource group")
        .option("--capacity -c <name>", "Name of the Azure dedicated capacity");
    stopCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Changes the specific capacity information")
        .action(updateAction)
        .option("--subscription -s <subscription>", "Name or ID of the Azure subscription")
        .option("--resource -r <resource>", "Name or ID of the Azure Resource group")
        .option("--capacity -c <name>", "Name of the Azure dedicated capacity")
        .option("--parameter <data>", "String with the capacity parameters in JSON format")
        .option("--parameter-file <file>", "File with the capacity parameters in JSON format");
    updateCommand.addGlobalOptions();
    const embeddedCommand = new ModuleCommand("embedded")
        .description("Operations for working with Embedded capacity")
        .addCommand(listCommand)
        .addCommand(showCommand)
        .addCommand(startCommand)
        .addCommand(stopCommand)
        .addCommand(updateCommand);
    embeddedCommand.addGlobalOptions();
    return embeddedCommand;
}
