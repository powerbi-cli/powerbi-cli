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
import { showExportAction } from "./show";
import { downloadExportAction } from "./download";
import { startExportAction } from "./start";

export function getCommands(): ModuleCommand {
    const downloadCommand = new ModuleCommand("download")
        .description("Download the exported Power BI report")
        .action(downloadExportAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report")
        .option("--export <export>", "ID of the Power BI report export");
    downloadCommand.addGlobalOptions();
    const startCommand = new ModuleCommand("start")
        .description("Start a Power BI report export")
        .action(startExportAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report")
        .option(
            "--format <format>",
            `Format of the exported report.
                      Supported: PDF, PPTX (All report types)
                                 PBIX (Power BI reports)
                                 CSV, DOCX, IMAGE, MHTML,  PNG, XLSX, XML (Paginated reports)`
        )
        .option("--config <data>", "String with additional export config in JSON format")
        .option("--config-file <file>", "File with additional export config in JSON format");
    startCommand.addGlobalOptions();
    const statusCommand = new ModuleCommand("status")
        .description("Get the status of a Power BI report export")
        .action(showExportAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--report -r <report>", "Name or ID of the Power BI report")
        .option("--export <export>", "ID of the Power BI report export");
    statusCommand.addGlobalOptions();
    const parameterCommand = new ModuleCommand("export")
        .description("Manages the Power BI report experts")
        .addCommand(downloadCommand)
        .addCommand(statusCommand)
        .addCommand(startCommand);
    parameterCommand.addGlobalOptions();
    return parameterCommand;
}
