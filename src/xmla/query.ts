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
import { readFileSync } from "fs";

import { getAccessToken } from "../lib/token";
import { ADOMDConnection } from "../lib/node-adomd/connection";
import { TokenType } from "../lib/auth";
import { ADOMDCommand } from "../lib/node-adomd/command";
import { formatAndPrintOutputRawStream } from "../lib/output";
import { ModuleCommand } from "../lib/command";
import { validateParameter, validateStartValues } from "../lib/parameters";
import { verbose } from "../lib/logging";

export async function queryAction(...args: unknown[]): Promise<void> {
    const cmd = args[args.length - 1] as ModuleCommand;
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;
    const connection = await validateParameter({
        name: options.C,
        isName: () => validateStartValues(options.C, "powerbi://"),
        missing: "error: missing option '--connection'",
        isRequired: true,
    });
    const catalog = await validateParameter({
        name: options.D,
        isName: () => Promise.resolve(options.D),
        missing: "error: missing option '--dataset'",
        isRequired: true,
    });
    if (options.script === undefined && options.scriptFile === undefined)
        throw "error: missing option '--script' or '--script-file'";
    const query = options.script || readFileSync(options.scriptFile);
    const token = await getAccessToken(TokenType.XMLA);
    if (token === "")
        throw "Not authenticated. Please run 'pbicli login --xmla' to login to the Power BI XMLA endpoints.";
    const connectionString = `Data Source=${connection};Catalog=${catalog};Password=${token}`;
    verbose(`Execute '${query}' to '${catalog}' on '${connection}'`);
    const adomdconn = new ADOMDConnection(connectionString);
    verbose(`Open connection`);
    await adomdconn.open();
    const adomdcmd = new ADOMDCommand(adomdconn);
    verbose("Execute command");
    const result = await adomdcmd.executeStream(query);
    await adomdconn.close();
    verbose("Stream to format and output result");
    formatAndPrintOutputRawStream(result, cmd.outputFormat, cmd.outputFile, cmd.jmsePath);
}
