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
import { listUserAction } from "./list-user";
import { unusedAction } from "./unused";
import { updateAction } from "./update";
import { modifiedAction } from "./modified";
import { resultAction } from "./result";
import { scanAction } from "./scan";
import { statusAction } from "./status";

export function getCommands(): ModuleCommand {
    const addUserCommand = new ModuleCommand("add-user")
        .alias("add")
        .description("Grants user permissions to the specified workspace")
        .action(addUserAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--email <email>", "Email address of the user")
        .option("--identifier <identifier>", "Identifier of the principal")
        .option("--access-right <right>", `Access right. Allowed values: ${accessRights.join(", ")}`)
        .option("--principal-type <type>", `Type of pricipal. Allowed values: ${principalTypes.join(", ")}`);
    addUserCommand.addGlobalOptions();
    const deleteUserCommand = new ModuleCommand("delete-user")
        .alias("delete")
        .description("Removes user permissions to the specified workspace")
        .action(deleteUserAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
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
    const listUserCommand = new ModuleCommand("list-user")
        .description("Returns a list of users that have access to the specified workspace")
        .action(listUserAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace");
    listUserCommand.addGlobalOptions();
    const modifiedCommand = new ModuleCommand("modified")
        .description("Gets a list of workspace IDs in the organization")
        .action(modifiedAction)
        .option("--modified <datetime>", "Last modified date (must be in ISO 8601 compliant UTC format)")
        .option("--personal-workspaces", "Include personal workspaces");
    modifiedCommand.addGlobalOptions();
    const restoreCommand = new ModuleCommand("restore")
        .description("Restores a deleted workspace")
        .action(restoreAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--owner <email>", "The email address of the owner of the group to be restored")
        .option("--name [name]", "The optional new name of the group to be restored");
    restoreCommand.addGlobalOptions();
    const resultCommand = new ModuleCommand("result")
        .description("Gets the scan result for the specified scan")
        .action(resultAction)
        .option("--scan-id <scanId>", "The scan ID for the triggered scan");
    resultCommand.addGlobalOptions();
    const scanCommand = new ModuleCommand("scan")
        .description("Initiates a scan to receive metadata for the requested list of workspaces")
        .action(scanAction)
        .option("--dataset-expressions", "Whether to return dataset expressions (Dax query and Mashup)")
        .option("--dataset-schema", "Whether to return dataset schema (Tables, Columns and Measures)")
        .option("--datasource-details", "Whether to return datasource details")
        .option("--artifact-users	", "Whether to return artifact user details (Permission level)")
        .option("--lineage", "Whether to return lineage info (upstream dataflows, tiles, datasource IDs)")
        .option("--workspace-file <file>", "File with the workspace IDs to add to the scan in JSON format");
    scanCommand.addGlobalOptions();
    const statusCommand = new ModuleCommand("status")
        .description("Gets the scan status for the specified scan")
        .action(statusAction)
        .option("--scan-id <scanId>", "The scan ID for the triggered scan");
    statusCommand.addGlobalOptions();
    const unusedCommand = new ModuleCommand("unused")
        .description("Returns a list of artifacts that have not been used within 30 days for the specified workspace")
        .action(unusedAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--continuation-token <token>", "Token to get the next chunk of the result set");
    unusedCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update-user")
        .alias("update")
        .description("Updates the specified workspace properties")
        .action(updateAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace")
        .option("--update-details <data>", "String with the update details in JSON format")
        .option("--update-details-file <file>", "File with the update details in JSON format");
    updateCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("workspace")
        .description("Manage workspaces as admin")
        .addCommand(addUserCommand)
        .addCommand(deleteUserCommand)
        .addCommand(listCommand)
        .addCommand(listUserCommand)
        .addCommand(modifiedCommand)
        .addCommand(restoreCommand)
        .addCommand(resultCommand)
        .addCommand(scanCommand)
        .addCommand(statusCommand)
        .addCommand(unusedCommand)
        .addCommand(updateCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
