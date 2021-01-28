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
import { OptionValues } from "commander";

import { ModuleCommand } from "../../lib/command";
import { createAction } from "./create";
import { listshowAction } from "./listshow";
import { statusAction } from "./status";
import { deleteAction } from "./delete";
import { updateAction } from "./update";
import { getCommands as getUserCommands } from "./user/index";

export function getCommands(): ModuleCommand {
    const createCommand = new ModuleCommand("create")
        .description("Create a datasource at a Power BI gateway")
        .action(createAction)
        .option("--gateway -g <gateway>", "Name or ID of the Power BI gateway")
        .option("--datasource <datasource>", "String with the datasource definition in JSON format")
        .option("--datasource-file <file>", "File with the datasource definition in JSON format");
    createCommand.addGlobalOptions();
    const deleteCommand = new ModuleCommand("delete")
        .description("Deletes a datasource at a Power BI gateway")
        .action(deleteAction)
        .option("--gateway -g <gateway>", "Name or ID of the Power BI gateway")
        .option("--datasource -d <datasource>", "Name or ID of the datasource of the Power BI gateway");
    deleteCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("List datasources of a Power BI gateway")
        .action(listshowAction)
        .option("--gateway -g <gateway>", "Name or ID of the Power BI gateway");
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the detail of a datasource of a Power BI gateway")
        .action(listshowAction)
        .option("--gateway -g <gateway>", "Name or ID of the Power BI gateway")
        .option("--datasource -d <datasource>", "Name or ID of the datasource of the Power BI gateway");
    showCommand.addGlobalOptions();
    const statusCommand = new ModuleCommand("status")
        .description("Get the status details of a datasource of a Power BI gateway")
        .action(statusAction)
        .option("--gateway -g <gateway>", "Name or ID of the Power BI gateway")
        .option("--datasource -d <datasource>", "Name or ID of the datasource of the Power BI gateway");
    statusCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Update a datasource at a Power BI gateway")
        .action(updateAction)
        .option("--gateway -g <gateway>", "Name or ID of the Power BI gateway")
        .option("--datasource -d <datasource>", "Name or ID of the datasource of the Power BI gateway")
        .option("--credential <credential>", "String with the datasource credential definition in JSON format")
        .option("--credential-file <file>", "File with the datasource credential definition in JSON format");
    updateCommand.addGlobalOptions();
    const gatewayCommand = new ModuleCommand("datasource")
        .description("Manage datasources of a Power BI gateway")
        .addCommand(createCommand)
        .addCommand(deleteCommand)
        .addCommand(listCommand)
        .addCommand(statusCommand)
        .addCommand(showCommand)
        .addCommand(updateCommand)
        .addCommand(getUserCommands());
    gatewayCommand.addGlobalOptions();
    return gatewayCommand;
}
