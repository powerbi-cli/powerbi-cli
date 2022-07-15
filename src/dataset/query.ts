/*
 * Copyright (c) 2021 Jan Pieter Posthuma / DataScenarios
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

import { ModuleCommand } from "../lib/command";
import { validateDatasetId, validateGroupId } from "../lib/parameters";
import { debug } from "../lib/logging";
import { APICall, executeAPICallStream } from "../lib/api";

export async function queryAction(...args: unknown[]): Promise<void> {
    const cmd = args[args.length - 1] as ModuleCommand;
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;

    const groupId = await validateGroupId(options.W, false);
    const datasetId = await validateDatasetId(groupId as string, options.D, true);

    if (
        options.dax === undefined &&
        options.daxFile === undefined &&
        options.script === undefined &&
        options.scriptFile === undefined
    )
        throw "error: missing option '--dax', '--dax-file', '--script' or '--script-file'";
    const script =
        options.script || options.scriptFile
            ? options.scriptFile
                ? readFileSync(options.scriptFile)
                : options.script
            : undefined;
    const query =
        options.dax || options.daxFile ? (options.daxFile ? readFileSync(options.daxFile) : options.dax) : undefined;

    debug(`Execute query against Power BI dataset (${datasetId})`);

    const request: APICall = {
        method: "POST",
        url: `/datasets/${datasetId}/executeQueries`,
        body: query
            ? `{ "queries": [{ "query": "${query}" }], "serializerSettings": { "includeNulls": true }}`
            : script,
        containsValue: true,
    };
    await executeAPICallStream(
        request,
        cmd.outputFormat,
        cmd.outputFile,
        cmd.jmsePath || "[results[0].tables[0].rows]"
    );
}
