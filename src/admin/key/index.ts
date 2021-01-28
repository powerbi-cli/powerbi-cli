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
import { addAction } from "./add";
import { listAction } from "./list";
import { rotateAction } from "./rotate";

export function getCommands(): ModuleCommand {
    const addCommand = new ModuleCommand("add")
        .description("Adds an encryption key for Power BI workspaces assigned to a capacity")
        .action(addAction)
        .option("--name <name>", "The name of the encryption key")
        .option("--keyVaultURI <uri>", "Uri to the version of the Azure Key Vault key to be used")
        .option("--active", "Indicates to activate any inactivated capacities to use this key for its encryption")
        .option(
            "--default",
            "Indicates that this key is set as default for the entire tenant. Any new capacity creation will inherit this key upon creation"
        );
    addCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("Returns the encryption keys for the tenant")
        .action(listAction);
    listCommand.addGlobalOptions();
    const rotateCommand = new ModuleCommand("rotate")
        .description("Adds an encryption key for Power BI workspaces assigned to a capacity")
        .action(rotateAction)
        .option("--key <id>", "ID of the encryption key")
        .option("--keyVaultURI <uri>", "Uri to the version of the Azure Key Vault key to be used");
    rotateCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("key")
        .description("Manage Power BI encryption keys")
        .addCommand(addCommand)
        .addCommand(listCommand)
        .addCommand(rotateCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
