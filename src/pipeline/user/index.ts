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
import { listUserAction } from "./list";
import { deleteUserAction } from "./delete";
import { updateUserAction } from "./update";
import { principalTypes, pipelineAccessRights } from "../../lib/helpers";

export function getCommands(): ModuleCommand {
    const listCommand = new ModuleCommand("list")
        .description("List user and service pricipal with access")
        .action(listUserAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline");
    listCommand.addGlobalOptions();
    const updateCommand = new ModuleCommand("update")
        .description("Update access of a user or service pricipal")
        .action(updateUserAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline")
        .option("--identifier <identifier>", "Identifier of the user or principal")
        .option("--access-right <right>", `Access right. Allowed values: ${pipelineAccessRights.join(", ")}`)
        .option("--principal-type <type>", `Type of pricipal. Allowed values: ${principalTypes.join(", ")}`);
    updateCommand.addGlobalOptions();
    const deleteCommand = new ModuleCommand("delete")
        .description("Revoke access of a user or service pricipal")
        .action(deleteUserAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline")
        .option("--identifier <identifier>", "Identifier of the user or principal");
    deleteCommand.addGlobalOptions();
    const userCommand = new ModuleCommand("user")
        .description("Manage users of Power BI pipelines")
        .addCommand(listCommand)
        .addCommand(deleteCommand)
        .addCommand(updateCommand);
    userCommand.addGlobalOptions();
    return userCommand;
}
