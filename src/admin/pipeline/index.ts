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
import { expandAdminPipelines, principalTypes, accessRightsPipeline } from "../../lib/helpers";
import { listAction } from "./list";
import { deleteUserAction } from "./deleteUser";
import { listUserAction } from "./list-user";
import { updateUserAction } from "./updateUser";

export function getCommands(): ModuleCommand {
    const deleteUserCommand = new ModuleCommand("delete-user")
        .description("Removes user permissions to the specified workspace")
        .action(deleteUserAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline")
        .option("--identifier <identifier>", "Identifier of the user or principal");
    deleteUserCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("Returns a list of workspaces for the organization")
        .action(listAction)
        .option(
            "--expand <entity>",
            `Expands related entities inline, receives a comma-separated list of data types. Allowed values: ${expandAdminPipelines.join(
                ", "
            )}`
        )
        .option("--filter <filter>", "Filters the results based on a boolean condition")
        .option("--top <number>", "Returns only the first <number> results. Default: 5000")
        .option("--skip <number>", "Skips the first <number> results");
    listCommand.addGlobalOptions();
    const listUserCommand = new ModuleCommand("list-user")
        .description("Returns a list of users that have access to the specified workspace")
        .action(listUserAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline");
    listUserCommand.addGlobalOptions();
    const updateUserCommand = new ModuleCommand("update-user")
        .description("Updates the specified workspace properties")
        .action(updateUserAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline")
        .option("--identifier <identifier>", "Identifier of the user or principal")
        .option("--access-right <right>", `Access right. Allowed values: ${accessRightsPipeline.join(", ")}`)
        .option("--principal-type <type>", `Type of pricipal. Allowed values: ${principalTypes.join(", ")}`);
    updateUserCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("pipeline")
        .description("Operations for working with pipelines as admin")
        .addCommand(deleteUserCommand)
        .addCommand(listCommand)
        .addCommand(listUserCommand)
        .addCommand(updateUserCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
