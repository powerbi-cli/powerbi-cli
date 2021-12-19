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
import { artifactAction } from "./artifact";
import { listshowAction } from "./list";

export function getCommands(): ModuleCommand {
    const artifactCommand = new ModuleCommand("artifact")
        .description("List the artifacts of a Power BI pipeline stage")
        .action(artifactAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline")
        .option("--stage -s <number>", "Number of the Power BI pipeline stage");
    artifactCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list")
        .description("List the stages of a Power BI pipeline")
        .action(listshowAction)
        .option("--pipeline -p <name>", "Name or ID of the Power BI pipeline");
    listCommand.addGlobalOptions();
    const pipelineStageCommand = new ModuleCommand("stage")
        .description("Operations for working with stages of pipelines")
        .addCommand(artifactCommand)
        .addCommand(listCommand);
    pipelineStageCommand.addGlobalOptions();
    return pipelineStageCommand;
}
