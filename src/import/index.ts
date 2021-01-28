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

import { ModuleCommand } from "../lib/command";
import { listshowAction } from "./listshow";
import { datasetNamingConflictRDL, datasetNamingConflictDF, datasetNamingConflictPBIX } from "../lib/helpers";
import { createAction } from "./create";

export function getCommands(): ModuleCommand {
    const pbixCommand = new ModuleCommand("pbix")
        .description("Upload of Power BI PBIX file (< 1GB)")
        .action(createAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--file <path>", "Path to the PBIX file")
        .option("--name <name>", "The display name of the dataset with file extension. Default the file name is used")
        .option(
            "--conflict <option>",
            `Option to resolve a dataset name conflict. Default value is 'Ignore'. Allowed values: ${datasetNamingConflictPBIX.join(
                ", "
            )}`
        )
        .option("--skip-report", "Do not import the report from the PBIX file");
    pbixCommand.addGlobalOptions();
    const largepbixCommand = new ModuleCommand("pbix-large")
        .description("Start an upload of Power BI PBIX file (> 1GB, < 10GB)")
        .action(createAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--name <name>", "The display name of the dataset")
        .option("--url <url>", "Url of the temporary blob storage")
        .option(
            "--conflict <option>",
            `Option to resolve a dataset name conflict. Default value is 'Ignore'. Allowed values: ${datasetNamingConflictPBIX.join(
                ", "
            )}`
        )
        .option("--skip-report", "Do not import the report from the PBIX file");
    largepbixCommand.addGlobalOptions();
    const rdlCommand = new ModuleCommand("rdl")
        .description("Upload of Power BI RDL file")
        .action(createAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--file <file>", "Path to the RDL file")
        .option("--name <name>", "The display name of the report with file extension. Default the file name is used")
        .option(
            "--conflict <option>",
            `Option to resolve a report name conflict. Allowed values: ${datasetNamingConflictRDL.join(", ")}`
        );
    rdlCommand.addGlobalOptions();
    const dataflowCommand = new ModuleCommand("dataflow")
        .description("Upload of Power BI dataflow JSON file")
        .action(createAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--file <file>", "Path to the dataflow JSON file")
        .option(
            "--conflict <option>",
            `Option to resolve a dataflow name conflict. Allowed values: ${datasetNamingConflictDF.join(", ")}`
        );
    dataflowCommand.addGlobalOptions();
    // const xlsxCommand = new ModuleCommand("xlsx")
    //     .description("Upload of Microsoft Excel XLSX file")
    //     .option("--group -g <name>", "Name or ID of the Power BI group")
    //     .option("--file <file>", "Path to Microsoft Excel XLSX file")
    //     .option(
    //         "--name <name>",
    //         "The display name of the dataset with file extension. Default the file name is used and ignored when importing from OneDrive"
    //     )
    //     .option("--onedrive", "The excel file is imported from OneDrive for Business")
    //     .option("--connection-type <value>", "Allowed values: connect, import")
    //     .option(
    //         "--conflict <option>",
    //         `Option to resolve a dataset name conflict. Default value is 'Ignore'. Allowed values: ${datasetNamingConflictPBIX.join(
    //             ", "
    //         )}`
    //     );
    // xlsxCommand.addGlobalOptions();
    const listCommand = new ModuleCommand("list").action(listshowAction).description("List Power BI imports");
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the details of a Power BI import")
        .action(listshowAction)
        .option("--workspace -w <name>", "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'")
        .option("--import -i <import>", "Name or ID of the Power BI import");
    showCommand.addGlobalOptions();
    const tempCommand = new ModuleCommand("temp")
        .description("Creates a temporaty upload location for a Power BI report")
        .action(listshowAction)
        .option(
            "--workspace -w <name>",
            "Name or ID of the Power BI workspace. If not provided it uses 'My workspace'"
        );
    tempCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("import")
        .description("Manage Power BI imports")
        .addCommand(dataflowCommand)
        .addCommand(listCommand)
        .addCommand(pbixCommand)
        .addCommand(largepbixCommand)
        .addCommand(rdlCommand)
        .addCommand(showCommand)
        .addCommand(tempCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
