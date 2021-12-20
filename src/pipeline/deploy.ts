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
import { debug } from "../lib/logging";
import { APICall, executeAPICall } from "../lib/api";
import { validatePipelineId } from "../lib/parameters";

export async function deployAction(...args: unknown[]): Promise<void> {
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;

    const pipelineId = await validatePipelineId(options.P, true);

    if (options.options === undefined && options.optionsFile === undefined)
        throw "error: missing option '--options' or '--options-file'";
    const deployOptions = options.options
        ? JSON.parse(options.options)
        : JSON.parse(readFileSync(options.optionsFile, "utf8"));

    debug(`Deploy from a specific stage in a Power BI pipeline (${pipelineId})`);

    const request: APICall = {
        method: "POST",
        url: `/pipelines/${pipelineId}/${options.partial ? `deploy` : `deployAll`}`,
        body: deployOptions,
    };

    await executeAPICall(request);
}
