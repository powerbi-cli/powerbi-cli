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
import { expandAdminGroups, accessRights, principalTypes } from "../../lib/helpers";
import { listAction } from "./list";
import { restoreAction } from "./restore";
import { deleteUserAction } from "./deleteUser";
import { addUserAction } from "./addUser";

export function getCommands(): ModuleCommand {
    const addUserCommand = new ModuleCommand("add")
        .description("Grants user permissions to the specified workspace")
        .action(addUserAction)
        .option("--group -g <name>", "Name or ID of the Power BI group")
        .option("--email <email>", "Email address of the user")
        .option("--identifier <identifier>", "Identifier of the principal")
        .option("--access-right <right>", `Access right. Allowed values: ${accessRights.join(", ")}`)
        .option("--principal-type <type>", `Type of pricipal. Allowed values: ${principalTypes.join(", ")}`);
    addUserCommand.addGlobalOptions();
    const deleteUserCommand = new ModuleCommand("delete")
        .description("Removes user permissions to the specified workspace")
        .action(deleteUserAction)
        .option("--group -g <name>", "Name or ID of the Power BI group")
        .option("--user <UPN>", "The user principal name (UPN) of the user to remove");
    deleteUserCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("Returns a list of workspaces for the organization")
        .action(listAction)
        .option(
            "--expand <entity>",
            `Expands related entities inline, receives a comma-separated list of data types. Allowed values: ${expandAdminGroups.join(
                ", "
            )}`
        )
        .option("--filter <filter>", "Filters the results based on a boolean condition")
        .option("--top <number>", "Returns only the first <number> results. Default: 5000")
        .option("--skip <number>", "Skips the first <number> results");
    listCommand.addGlobalOptions();
    const restoreCommand = new ModuleCommand("restore")
        .description("Restores a deleted workspace")
        .action(restoreAction)
        .option("--group -g <name>", "Name or ID of the deleted Power BI group")
        .option("--owner <email>", "The email address of the owner of the group to be restored")
        .option("--name [name]", "The optional new name of the group to be restored");
    restoreCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Updates the specified workspace properties")
        .action(restoreAction)
        .option("--group -g <name>", "Name or ID of the Power BI group")
        .option("--update-details <data>", "String with the update details in JSON format")
        .option("--update-details-file <file>", "File with the update details in JSON format");
    updateCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("group")
        .description("Manage groups as admin")
        .addCommand(addUserCommand)
        .addCommand(deleteUserCommand)
        .addCommand(listCommand)
        .addCommand(restoreCommand)
        .addCommand(updateCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
