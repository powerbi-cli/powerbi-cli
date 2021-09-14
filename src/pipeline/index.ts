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
import { getCommands as getStageCommands } from "./stage/index";
import { getCommands as getOperationCommands } from "./operation/index";

export function getCommands(): ModuleCommand {
    const listCommand = new ModuleCommand("list").description("List Power BI pipelines").action(listshowAction);
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI pipeline")
        .action(listshowAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline");
    showCommand.addGlobalOptions();
    const pipelineCommand = new ModuleCommand("pipeline")
        .description("Manage Power BI pipelines")
        .addCommand(listCommand)
        .addCommand(showCommand)
        .addCommand(getStageCommands())
        .addCommand(getOperationCommands());
    pipelineCommand.addGlobalOptions();
    return pipelineCommand;
}
