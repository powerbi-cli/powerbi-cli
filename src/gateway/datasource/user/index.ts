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

import { ModuleCommand } from "../../../lib/command";
import { addAction } from "./add";
import { listAction } from "./list";
import { deleteAction } from "./delete";
import { principalTypes, accessRightsDataSource } from "../../../lib/helpers";

export function getCommands(): ModuleCommand {
    const addCommand = new ModuleCommand("add")
        .description("Add user to a datasource of a Power BI gateway")
        .action(addAction)
        .option("--gateway -g <gateway>", "Name or ID of the Power BI gateway")
        .option("--datasource -d <datasource>", "Name or ID of the datasource of the Power BI gateway")
        .option("--email <email>", "Email address of the user")
        .option("--identifier <identifier>", "Identifier of the principal")
        .option("--access-right <right>", `Access right. Allowed values: ${accessRightsDataSource.join(", ")}`)
        .option("--principal-type <type>", `Type of pricipal. Allowed values: ${principalTypes.join(", ")}`);
    addCommand.addGlobalOptions();
    const deleteCommand = new ModuleCommand("delete")
        .description("Delete user from the datasource of a Power BI gateway")
        .action(deleteAction)
        .option("--gateway -g <gateway>", "Name or ID of the Power BI gateway")
        .option("--datasource -d <datasource>", "Name or ID of the datasource of the Power BI gateway")
        .option("--email <email>", "Email address of the user")
        .option("--identifier <identifier>", "Identifier of the principal");
    deleteCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("Retrieve users for the datasource of a Power BI gateway")
        .action(listAction)
        .option("--gateway -g <gateway>", "Name or ID of the Power BI gateway")
        .option("--datasource -d <datasource>", "Name or ID of the datasource of the Power BI gateway");
    listCommand.addGlobalOptions();
    const gatewayCommand = new ModuleCommand("user")
        .description("Manage datasources users of a Power BI gateway")
        .addCommand(addCommand)
        .addCommand(deleteCommand)
        .addCommand(listCommand);
    gatewayCommand.addGlobalOptions();
    return gatewayCommand;
}
